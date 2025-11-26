# 🔧 TECHNICAL DETAILS — KXW PLAN 2.0

## LZT API ENDPOINTS REFERENCE

### Category IDs (from z.json)
```
1  = Steam
4  = Warface
9  = Fortnite
11 = Battle.net
12 = Epic Games
13 = Valorant
15 = Clash of Clans
28 = Minecraft
```

### Key API Endpoints
```
GET /                    - Get all latest items
GET /steam               - Steam accounts
GET /valorant            - Valorant accounts
GET /{itemId}            - Single item details
POST /{itemId}/fast-buy  - Purchase item
GET /user/{userId}/items - Seller's items
GET /me                  - Current user info
GET /payments/balance/list - Check balance
```

### Common Query Parameters
```
page, pmin, pmax, title, order_by, tag_id,
origin, user_id, nsb, currency, email_login_data
```

---

## FIRESTORE SCHEMA

### users/{uid}
```typescript
{
  username: string,
  email: string,
  balance: number,
  currency: 'USD',
  isVerified: boolean,
  trustScore: number,
  role?: 'admin' | 'user',
  created_at: Timestamp,
  ownedAssets: [] // IDs only, not full items
}
```

### payment_requests/{id}
```typescript
{
  user_id: string,
  amount: number,
  currency: 'INR' | 'USD',
  method: 'upi' | 'crypto',
  status: 'awaiting_payment' | 'pending' | 'approved' | 'rejected',
  upi_ref_number?: string,
  crypto_tx_hash?: string,
  fee: number,
  net_amount_usd: number,
  created_at: Timestamp,
  approved_at?: Timestamp,
  approved_by?: string,
  notes?: string
}
```

### purchased_items/{id}
```typescript
{
  user_id: string,
  lzt_item_id: number,
  item_title: string,
  login: string,
  password: string,
  raw_data?: string,
  purchase_price: number,
  created_at: Timestamp
}
```

---

## GLASS CSS PATTERNS

### Full Glass Panel
```css
.glass-tahoe {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}
```

### Glow Effects
```css
.glow-purple { box-shadow: 0 0 30px rgba(124, 58, 237, 0.4); }
.glow-blue { box-shadow: 0 0 30px rgba(59, 130, 246, 0.4); }
.glow-green { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
```

### Button States
```css
.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}
.btn-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

---

## ANIMATION PATTERNS

### Page Transitions
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3 }}
>
```

### Stagger Children
```typescript
const container = {
  animate: { transition: { staggerChildren: 0.1 } }
};
const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
```

---

## PROTECTED ROUTE PATTERN

### middleware.ts
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('__session')?.value;
  const path = request.nextUrl.pathname;
  
  const protectedPaths = ['/profile', '/add-funds', '/purchase'];
  const isProtected = protectedPaths.some(p => path.startsWith(p));
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/?login=required', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/add-funds/:path*', '/purchase/:path*']
};
```

---

## PURCHASE API FLOW

### Request
```typescript
POST /api/purchase
Authorization: Bearer <firebase_token>
{
  itemId: 123456,
  originalPrice: 50,    // LZT price
  displayPrice: 107,    // Our price (50*2 + 7)
  itemTitle: "Valorant Radiant Account"
}
```

### Response (Success)
```typescript
{
  success: true,
  transactionId: "tx_abc123",
  credentialsId: "cred_xyz789"
}
```

### Response (Error)
```typescript
{
  success: false,
  error: "Insufficient balance",
  required: 107,
  current: 50
}
```

---

## PRICING FORMULA

```typescript
function calculatePrice(lztPrice: number) {
  const markup = lztPrice * 2;          // 2x
  const margin = lztPrice < 20 ? 2 : 5; // $2 or $5
  return markup + margin;
}

// Examples:
// $10 LZT → $22 display (10*2 + 2)
// $50 LZT → $105 display (50*2 + 5)
// $100 LZT → $205 display (100*2 + 5)
```

---

## WEBHOOK VERIFICATION

### NOWPayments
```typescript
const crypto = require('crypto');
const signature = req.headers['x-nowpayments-sig'];
const hmac = crypto.createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET);
hmac.update(JSON.stringify(sortedParams));
const valid = signature === hmac.digest('hex');
```

### UPI (Custom)
```typescript
// Verify based on your payment provider's documentation
// Common: UTR verification via bank API
```

---

## ENV VARIABLES REQUIRED

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (base64 encoded service account)
FIREBASE_SERVICE_ACCOUNT_KEY=

# LZT Market
LZT_API_BASE=https://api.lzt.market
LZT_TOKEN=your_lzt_token

# NOWPayments
NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=

# UPI
UPI_VPA=yourname@upi
```

---

## COMPONENT ARCHITECTURE

```
components/
├── ui/                    # Reusable primitives
│   ├── GlassCard.tsx
│   ├── GlassButton.tsx
│   ├── GlassModal.tsx
│   ├── Skeleton.tsx
│   └── Counter.tsx
├── marketplace/           # Marketplace specific
│   ├── ItemCard.tsx
│   ├── ItemDetailView.tsx
│   ├── FilterBar.tsx
│   └── PurchaseModal.tsx
├── payment/              # Payment flows
│   ├── UPIPaymentFlow.tsx
│   ├── CryptoPayment.tsx
│   └── PaymentStatus.tsx
├── auth/                 # Auth components
│   ├── AuthModal.tsx
│   └── ProtectedRoute.tsx
└── admin/                # Admin specific
    ├── PaymentQueue.tsx
    ├── UserTable.tsx
    └── StatsCard.tsx
```

---

## TESTING CHECKLIST

### Auth
- [ ] Google login works
- [ ] Email signup works
- [ ] Email login works
- [ ] Password reset works
- [ ] Logout works
- [ ] Session persists on refresh

### Marketplace
- [ ] Items load from LZT API
- [ ] Filters work
- [ ] Search works
- [ ] Pagination works
- [ ] Item detail loads

### Payments
- [ ] UPI QR generates
- [ ] Crypto address generates
- [ ] Webhook receives payment
- [ ] Admin sees pending
- [ ] Approval credits balance

### Purchase
- [ ] Balance check works
- [ ] Purchase deducts balance
- [ ] Credentials save
- [ ] Failure refunds

---

## READY TO START

When you say "start Phase 0", I will:
1. Verify Firebase connection
2. Test all env variables
3. Clean up any TypeScript errors
4. Prepare for Phase 1

When you say "start Phase 1", I will:
1. Enhance lzt-api.ts with full functions
2. Create type definitions
3. Update API routes
4. Remove mock data

And so on for each phase.

**Your call!** 🚀
