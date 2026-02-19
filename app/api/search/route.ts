import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

/** Escape a string for safe use inside a PostgreSQL regex (word-boundary match). */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Build regex pattern for whole-word, case-insensitive match in PostgreSQL (\m and \M are word boundaries). */
function wordBoundaryPattern(term: string): string {
  return "\\m(?:".concat(escapeRegex(term), ")\\M");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type"); // 'all', 'products', or 'services'
    const categoryId = searchParams.get("categoryId") || undefined;
    const subcategoryId = searchParams.get("subcategoryId") || undefined;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: { products: [], projects: [], services: [], total: 0 },
      });
    }

    const searchTerm = query.trim();
    const pattern = wordBoundaryPattern(searchTerm);
    let products: any[] = [];
    let projects: any[] = [];
    let services: any[] = [];

    // Search products: exact whole-word match, optional category/subcategory filter
    if (!type || type === "all" || type === "products") {
      const productIds = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Product"
        WHERE "publishOnWebsite" = true AND status = 'active'
        AND (title ~* ${pattern}::text OR (description IS NOT NULL AND description ~* ${pattern}::text))
        ${subcategoryId ? Prisma.sql`AND "subcategoryId" = ${subcategoryId}` : Prisma.empty}
        ${categoryId && !subcategoryId ? Prisma.sql`AND "subcategoryId" IN (SELECT id FROM "ProductSubcategory" WHERE "categoryId" = ${categoryId})` : Prisma.empty}
        ORDER BY "createdAt" DESC
        LIMIT 20
      `;
      const ids = productIds.map((r) => r.id);
      if (ids.length > 0) {
        products = await prisma.product.findMany({
          where: { id: { in: ids } },
          include: {
            subcategory: { include: { category: true } },
          },
          orderBy: { createdAt: "desc" },
        });
        // Preserve order from raw query
        const orderMap = new Map(ids.map((id, i) => [id, i]));
        products.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
      }
    }

    // Search services: exact whole-word match
    if (!type || type === "all" || type === "services") {
      const serviceIds = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Service"
        WHERE "publishOnWebsite" = true
        AND (title ~* ${pattern}::text OR (description IS NOT NULL AND description ~* ${pattern}::text))
        ORDER BY "createdAt" DESC
        LIMIT 20
      `;
      const ids = serviceIds.map((r) => r.id);
      if (ids.length > 0) {
        services = await prisma.service.findMany({
          where: { id: { in: ids } },
          include: {
            subcategory: { include: { category: true } },
          },
          orderBy: { createdAt: "desc" },
        });
        const orderMap = new Map(ids.map((id, i) => [id, i]));
        services.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
      }
    }

    // Search projects: exact whole-word match (only when type is 'all')
    if (!type || type === "all") {
      const projectIds = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Project"
        WHERE "publishOnWebsite" = true
        AND (
          title ~* ${pattern}::text
          OR (description IS NOT NULL AND description ~* ${pattern}::text)
          OR (client IS NOT NULL AND client ~* ${pattern}::text)
          OR (location IS NOT NULL AND location ~* ${pattern}::text)
        )
        ORDER BY "createdAt" DESC
        LIMIT 20
      `;
      const ids = projectIds.map((r) => r.id);
      if (ids.length > 0) {
        projects = await prisma.project.findMany({
          where: { id: { in: ids } },
          orderBy: { createdAt: "desc" },
        });
        const orderMap = new Map(ids.map((id, i) => [id, i]));
        projects.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        products,
        projects,
        services,
        total: products.length + projects.length + services.length,
      },
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
