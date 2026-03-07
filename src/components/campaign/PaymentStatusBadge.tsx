import { Badge } from "@/components/ui/badge";
import { DollarSign, ShieldCheck, ArrowUpRight } from "lucide-react";
import type { PaymentStatus } from "@/lib/campaign-store";

const config: Record<PaymentStatus, { label: string; variant: "destructive" | "secondary" | "default"; icon: typeof DollarSign }> = {
  awaiting: { label: "Awaiting payment", variant: "destructive", icon: DollarSign },
  secured: { label: "Payment secured", variant: "secondary", icon: ShieldCheck },
  released: { label: "Payment released", variant: "default", icon: ArrowUpRight },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, variant, icon: Icon } = config[status];
  return (
    <Badge variant={variant} className="text-xs gap-1">
      <Icon size={11} /> {label}
    </Badge>
  );
}
