import { Checkbox as CheckboxPrimitive, type CheckboxRootProps } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"
import { cn } from "cn"

function Checkbox({ className, ...props }: CheckboxRootProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-indigo-600 bg-white text-white shadow-xs outline-none transition-all focus-visible:ring-3 focus-visible:ring-indigo-600/40 data-[checked]:bg-indigo-600 data-[checked]:text-white disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator">
        <Check className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
