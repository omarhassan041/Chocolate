// ============================================
// PAYMENT METHODS — Mobile Money Somalia
// ============================================

export type PaymentMethod = {
  id: string
  name: string
  nameSo: string
  number: string
  color: string
  bgColor: string
  icon: string
  ussd?: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "evc",
    name: "EVC Plus",
    nameSo: "EVC Plus",
    number: process.env.NEXT_PUBLIC_EVC_NUMBER || "+252 61 555 1234",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    icon: "📱",
    ussd: "*770#",
  },
  {
    id: "zaad",
    name: "Zaad",
    nameSo: "Zaad",
    number: process.env.NEXT_PUBLIC_ZAAD_NUMBER || "+252 61 7400 796",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    icon: "💳",
    ussd: "*880#",
  },
  {
    id: "edahab",
    name: "eDahab",
    nameSo: "eDahab",
    number: process.env.NEXT_PUBLIC_EDAHAB_NUMBER || "+252 62 7400 796",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
    icon: "💰",
    ussd: "*799#",
  },
  {
    id: "sahal",
    name: "Sahal",
    nameSo: "Sahal",
    number: process.env.NEXT_PUBLIC_SAHAL_NUMBER || "+252 61 7400 796",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    icon: "📲",
    ussd: "*888#",
  },
]

export const BUSINESS_NAME =
  process.env.NEXT_PUBLIC_BUSINESS_NAME || "MireChocolate"

export const BUSINESS_PHONE =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+252 61 123 4567"

export function getPaymentMethod(id: string): PaymentMethod | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id)
}

export function formatPaymentNumber(number: string): string {
  return number.replace(/\s/g, "")
}