import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DollarSign, ShieldCheck, ArrowUpRight, Lock } from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import type { PaymentInfo } from "@/lib/campaign-store";

interface PaymentCardProps {
  payment: PaymentInfo;
  onFund: () => void;
}

export function PaymentCard({ payment, onFund }: PaymentCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Lock size={15} className="text-primary" /> Payment & Escrow
        </h2>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Campaign budget</span>
          <span className="font-semibold">${payment.budget.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Lumeya fee ({payment.platformFeePercent}%)</span>
          <span className="text-muted-foreground">-${payment.platformFee.toFixed(2)}</span>
        </div>
        <div className="border-t border-border my-1" />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Creator receives</span>
          <span className="font-semibold text-primary">${payment.creatorPayout.toFixed(2)}</span>
        </div>
      </div>

      {payment.status === "awaiting" && (
        <Button className="w-full mt-4 gap-2" onClick={onFund}>
          <DollarSign size={14} /> Fund Campaign — ${payment.budget.toFixed(2)}
        </Button>
      )}

      {payment.status === "secured" && (
        <p className="mt-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-primary" />
          Funds held securely until deliverables are approved
        </p>
      )}

      {payment.status === "released" && (
        <p className="mt-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <ArrowUpRight size={12} className="text-primary" />
          ${payment.creatorPayout.toFixed(2)} released to {" "}creator
        </p>
      )}
    </motion.section>
  );
}
