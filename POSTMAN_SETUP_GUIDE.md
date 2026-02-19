# Postman Collection Setup Guide

## Import the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **Upload Files**
4. Choose `postman_payment_collection.json`
5. Click **Import**

The collection will appear in your left sidebar with 3 requests.

---

## Environment Variables Setup

Before testing, set up the variables in Postman:

### 1. Set Base URL
- Click on the collection name
- Go to **Variables** tab
- Update `base_url`:
  - **Development:** `http://localhost:3000`
  - **Production:** `https://your-domain.com`

### 2. Get Product and Service IDs

Get actual IDs from your database:

```bash
# Get products
curl http://localhost:3000/api/products

# Get services
curl http://localhost:3000/api/services
```

Then update in Postman:
- `product_id` - Copy a product UUID
- `service_id` - Copy a service UUID

### 3. Update Email
- In the **Checkout** request body
- Change `"email": "john@example.com"` to a real user email in your database

---

## Testing Flow

### Step 1: Create Order (Checkout)

1. Click **1. Checkout - Create Order**
2. Review the request body
3. Click **Send**
4. Copy the `orderId` from response
5. Paste it in the collection variables as `order_id`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "orderNumber": "ORD-1704067200000-ABC123XYZ",
    "totalAmount": 1529.05,
    "orderStatus": "pending",
    "paymentStatus": "pending"
  }
}
```

### Step 2: Create Payment Intent

1. Click **2. Create Payment Intent**
2. The `orderId` will auto-populate from variables
3. Review the amount and currency
4. Click **Send**
5. Copy the `paymentIntentId` from response
6. Paste it in the collection variables as `payment_intent_id`

**Expected Response:**
```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_abcdefghijk",
  "paymentIntentId": "pi_1234567890"
}
```

### Step 3: Confirm Payment

1. Click **3. Confirm Payment**
2. Both `paymentIntentId` and `orderId` will auto-populate
3. Click **Send**
4. Verify payment is confirmed

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "orderNumber": "ORD-1704067200000-ABC123XYZ",
    "paymentStatus": "completed",
    "orderStatus": "confirmed"
  }
}
```

---

## Common Issues & Solutions

### Issue: "User not found"
**Solution:** 
- Make sure the email exists in your database
- Check that the user is created in the Users table

### Issue: "Product not found"
**Solution:**
- Verify the product_id is correct
- Get IDs from `/api/products` endpoint
- Make sure product exists in database

### Issue: "Missing required fields"
**Solution:**
- Check all required fields are filled
- Verify JSON syntax is correct
- Check Content-Type header is `application/json`

### Issue: "Payment not completed"
**Solution:**
- Make sure you called Create Payment Intent first
- Verify paymentIntentId is correct
- Check Stripe keys in .env are valid

---

## Using Variables in Requests

Postman variables are referenced with `{{variable_name}}`

**Available Variables:**
- `{{base_url}}` - API base URL
- `{{product_id}}` - Product UUID
- `{{service_id}}` - Service UUID
- `{{order_id}}` - Order ID (auto-populated)
- `{{payment_intent_id}}` - Payment Intent ID (auto-populated)

**To use a variable:**
1. Type `{{` in any field
2. Select the variable from dropdown
3. Or manually type `{{variable_name}}`

---

## Auto-Populate Variables from Responses

To automatically save response values to variables:

### For Checkout Request:
1. Click **Tests** tab
2. Add this script:
```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("order_id", jsonData.data.orderId);
}
```

### For Create Payment Intent:
1. Click **Tests** tab
2. Add this script:
```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("payment_intent_id", jsonData.paymentIntentId);
}
```

---

## Testing with Different Currencies

Update the currency in **Create Payment Intent** request:

```json
{
  "amount": 1529.05,
  "email": "john@example.com",
  "orderId": "{{order_id}}",
  "currency": "usd"
}
```

**Supported Currencies:**
- `eur` - Euro (€)
- `usd` - US Dollar ($)
- `gbp` - British Pound (£)
- `jpy` - Japanese Yen (¥)
- `cad` - Canadian Dollar (C$)
- `aud` - Australian Dollar (A$)

---

## Testing with Multiple Items

Update the items array in **Checkout** request:

```json
{
  "items": [
    {
      "type": "product",
      "itemId": "prod-1",
      "quantity": 2
    },
    {
      "type": "product",
      "itemId": "prod-2",
      "quantity": 1
    },
    {
      "type": "service",
      "itemId": "serv-1",
      "quantity": 3
    }
  ],
  ...
}
```

---

## Exporting Results

To save test results:

1. Click **...** menu on request
2. Select **Save as Example**
3. Or click **Send** and then **Save Response**

---

## Troubleshooting

### Check Server Logs
```bash
# If running locally
npm run dev
# Check terminal for error messages
```

### Verify Database Connection
```bash
# Check if user exists
SELECT * FROM "Users" WHERE email = 'john@example.com';

# Check if product exists
SELECT * FROM "Product" WHERE id = 'product-uuid';
```

### Test Stripe Keys
- Verify `STRIP_SECRET_KEY` in .env
- Verify `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` in .env
- Use test keys (pk_test_*, sk_test_*)

---

## Next Steps

1. **Test locally** with development URLs
2. **Verify all responses** match expected format
3. **Update to production** URLs when ready
4. **Share collection** with team members
5. **Document any custom** modifications

---

## Support

For issues:
1. Check error message in response
2. Review PAYMENT_API_DOCUMENTATION.md
3. Check server logs
4. Verify database records
5. Test with Stripe dashboard
