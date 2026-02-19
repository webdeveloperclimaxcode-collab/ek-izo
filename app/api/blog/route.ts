import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const year = searchParams.get("year");

    const where: any = {
      publishOnWebsite: true,
    };

    // Filter by category (topic)
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by year: match publishedAt in range, or createdAt in range when publishedAt is null
    if (year) {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { publishedAt: { gte: startDate, lte: endDate } },
          {
            AND: [
              { publishedAt: null },
              { createdAt: { gte: startDate, lte: endDate } },
            ],
          },
        ],
      });
    }

    // Filter by featured
    if (featured === "true") {
      where.featured = true;
    }

    // Search by keywords in title, content, or tags
    if (search && search.trim()) {
      const searchTrimmed = search.trim();
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          {
            title: {
              contains: searchTrimmed,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchTrimmed,
              mode: "insensitive",
            },
          },
          {
            tags: {
              hasSome: [searchTrimmed],
            },
          },
        ],
      });
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      title,
      content,
      author,
      featuredImage,
      images,
      categoryId,
      tags,
      metaTitle,
      metaDescription,
      publishOnWebsite,
      showOnHomepage,
      featured,
      publishedAt,
    } = body;

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        author,
        featuredImage: featuredImage || null,
        images: images || [],
        categoryId: categoryId || null,
        tags: tags || [],
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        publishOnWebsite: publishOnWebsite !== false,
        showOnHomepage: showOnHomepage === true,
        featured: featured === true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to create blog",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete blog" },
      { status: 500 }
    );
  }
}
