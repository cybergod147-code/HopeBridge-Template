export const paymentConfig = {
  bitcoinAddress: "bc1qhopebridge7x3m4k9u6globalimpact",
  paypalEmail: "giving@hopebridge.org",
  bankDetails: {
    bankName: "Civic Trust Bank",
    accountName: "HopeBridge International",
    accountNumber: "0048 0192 7736",
    swift: "CTBKGHAC"
  },
  methods: {
    bank: { enabled: true, label: "Bank transfer" },
    paypal: { enabled: true, label: "PayPal" },
    bitcoin: { enabled: true, label: "Bitcoin" }
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_configure_me"
  }
} as const;
