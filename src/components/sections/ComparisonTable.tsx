import { Check, CircleHelp, Minus } from 'lucide-react';
import { COMPARISON_ROWS, PROTECTION_PLANS, type ComparisonValue } from '@/data/plans';

function ComparisonCell({ value, planName }: { value: ComparisonValue; planName: string }) {
  if (value === 'included') {
    return (
      <span className="inline-flex items-center gap-2 font-semibold text-primary-700">
        <Check size={18} aria-hidden="true" />
        <span>Included<span className="sr-only"> in {planName}</span></span>
      </span>
    );
  }
  if (value === 'confirm') {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-neutral-600">
        <CircleHelp size={16} aria-hidden="true" className="text-accent-700" />
        <span>Confirm in contract</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm text-neutral-500">
      <Minus size={16} aria-hidden="true" />
      <span>Not applicable<span className="sr-only"> to {planName}</span></span>
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 shadow-card">
      <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
        <caption className="sr-only">
          Coverage categories compared across Platinum, Gold, Powertrain, and Pre-Paid Maintenance plans
        </caption>
        <thead>
          <tr className="bg-primary-900 text-white">
            <th scope="col" className="w-1/5 px-6 py-5 font-display text-sm font-bold uppercase tracking-[0.14em]">
              Coverage category
            </th>
            {PROTECTION_PLANS.map((plan) => (
              <th key={plan.id} scope="col" className="px-6 py-5 font-display text-base font-bold">
                {plan.name}
                <span className="mt-1 block text-xs font-medium text-neutral-200">{plan.positioning}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-white">
          {COMPARISON_ROWS.map((row, rowIndex) => (
            <tr key={row.label} className={rowIndex % 2 === 1 ? 'bg-neutral-50' : undefined}>
              <th scope="row" className="px-6 py-5 font-semibold text-black">
                {row.label}
              </th>
              {row.values.map((value, columnIndex) => (
                <td key={PROTECTION_PLANS[columnIndex].id} className="px-6 py-5 align-middle">
                  <ComparisonCell value={value} planName={PROTECTION_PLANS[columnIndex].name} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 text-sm text-neutral-600">
        This overview is a general comparison. Pre-Paid Maintenance is a routine service plan and is not mechanical breakdown
        protection. Confirm all inclusions in your contract.
      </p>
    </div>
  );
}
