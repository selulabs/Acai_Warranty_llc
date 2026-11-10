import { Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import type { ProtectionPlan } from '@/data/plans';

interface PlanCardProps {
  plan: ProtectionPlan;
  showSummary?: boolean;
}

export default function PlanCard({ plan, showSummary = false }: PlanCardProps) {
  const isMaintenance = plan.category === 'maintenance';

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-lg border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-elevated ${
        isMaintenance ? 'border-accent-200 border-dashed' : 'border-neutral-200 shadow-card'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={plan.image}
          alt={plan.imageAlt}
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            isMaintenance ? 'bg-accent-50 text-accent-800' : 'bg-primary-50 text-primary-700'
          }`}
        >
          {isMaintenance ? 'Routine maintenance' : 'Mechanical breakdown protection'}
        </span>
        <h3 className="mt-4">{plan.name}</h3>
        <p className="mt-1 text-sm font-semibold text-accent-700">{plan.positioning}</p>
        {showSummary && <p className="mt-4 text-[15px] leading-[1.5] text-neutral-600">{plan.summary}</p>}

        <ul className="mt-6 space-y-3 border-t border-neutral-200 pt-6">
          {plan.categories.map((category) => (
            <li key={category} className="flex items-start gap-3 text-[15px] text-neutral-700">
              <Check size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
              {category}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <ButtonLink to="/contact" variant={isMaintenance ? 'outline' : 'primary'} className="w-full">
            Request a Quote for {plan.name}
          </ButtonLink>
          <p className="mt-4 text-xs leading-[1.5] text-neutral-500">
            Coverage varies by plan and contract. Review terms before enrolling.
          </p>
        </div>
      </div>
    </article>
  );
}
