import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  ArrowRight,
  BellRing,
  BookOpen,
  Building,
  CircleCheck,
  ClipboardCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpSchema, type SignUpValues } from "@/schemas/auth"
import { cn } from "cn"

const LABEL_CLASS = "block text-xs font-medium text-slate-600"

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Automated Attendance Registry",
    description: "Biometric, RFID card, or manual roll call check-ins.",
  },
  {
    icon: BellRing,
    title: "Instant Chronic Absenteeism Alerts",
    description: "Early warning notifications to counsellors and guardians.",
  },
  {
    icon: Lock,
    title: "Multi-Role Access Control",
    description: "Tailored permissions for Deans, Teachers, Students & Admins.",
  },
] as const

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin", icon: UserRound },
  { value: "teacher", label: "Teacher", icon: BookOpen },
  { value: "student", label: "Student", icon: GraduationCap },
] as const

const SignUpPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      institution: "",
      role: "admin",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onBlur",
  })

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")
  const role = watch("role")

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const strength = useMemo(() => {
    let score = 0
    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1

    const level =
      score >= 4 ? "Strong" : score === 3 ? "Good" : score === 2 ? "Fair" : "Weak"
    const color =
      score >= 4
        ? "text-emerald-600"
        : score === 3
          ? "text-sky-600"
          : score === 2
            ? "text-amber-600"
            : "text-red-500"
    const bar =
      score >= 4
        ? "bg-emerald-500"
        : score === 3
          ? "bg-sky-500"
          : score === 2
            ? "bg-amber-500"
            : "bg-red-500"

    return { score, level, color, bar }
  }, [password])

  const onSubmit = (values: SignUpValues) => {
    void values
    toast.success("Account created successfully", {
      description: "Welcome to EduAttend. Taking you to your dashboard.",
    })
    navigate("/dashboard", { replace: true })
  }

  const onInvalid = (validationErrors: typeof errors) => {
    const firstError = Object.values(validationErrors).find(Boolean)?.message
    toast.error("Please check your details", {
      description: String(firstError ?? "Complete all required fields to continue."),
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-none flex-col items-center overflow-x-hidden overflow-y-auto p-3 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:p-5">
      <div className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col md:flex-row border-0">
        <aside className="relative hidden md:flex md:w-[42%] flex-col gap-6 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-16 size-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 bottom-16 size-56 rounded-full bg-purple-400/20 blur-3xl"
          />

          <header className="relative flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
              <GraduationCap className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">EduAttend</span>
            <span className="ml-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] ring-1 ring-white/20">
              ACADEMIC SUITE
            </span>
          </header>

          <div className="relative space-y-6">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              Instant 14-Day Free Campus Trial
            </span>
            <h2 className="m-0 max-w-md text-[28px] leading-[1.2] font-bold tracking-tight text-white xl:text-[32px]">
              Track attendance. Manage courses. All in one place.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Join academic coordinators and teachers using EduAttend to eliminate paperwork,
              sync student records, and boost daily attendance.
            </p>
            <ul className="m-0 list-none space-y-3 p-0">
              {FEATURES.map((feature) => (
                <li
                  key={feature.title}
                  className="flex items-start gap-3 rounded-xl bg-white/10 p-3.5 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <span className="rounded-lg bg-white/15 p-2">
                    <feature.icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{feature.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-white/65">
                      {feature.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </aside>

        <section className="w-full md:w-[58%] bg-white p-6 sm:p-7">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>
              <p className="mt-1.5 mb-0 text-sm text-slate-500">
              Get started with EduAttend today
            </p>

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="mt-5 space-y-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className={LABEL_CLASS}>
                  Full name
                </Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Dr. Sarah Jenkins"
                    autoComplete="name"
                    className={cn(
                      "h-auto rounded-lg border px-3 py-2 pl-9 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-200",
                      errors.fullName
                        ? "border-red-400 focus-visible:border-red-400"
                        : "border-slate-200 focus-visible:border-indigo-500"
                    )}
                    aria-invalid={Boolean(errors.fullName)}
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="m-0 text-xs text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className={LABEL_CLASS}>
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarah.jenkins@university.edu"
                    autoComplete="email"
                    className={cn(
                      "h-auto rounded-lg border px-3 py-2 pl-9 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-200",
                      errors.email
                        ? "border-red-400 focus-visible:border-red-400"
                        : "border-slate-200 focus-visible:border-indigo-500"
                    )}
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="m-0 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="institution" className={LABEL_CLASS}>
                    Institution / Campus name
                  </Label>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    Optional
                  </span>
                </div>
                <div className="relative">
                  <Building className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="institution"
                    placeholder="Pacific Coast Institute of Technology"
                    autoComplete="organization"
                    className="h-auto rounded-lg border border-slate-200 px-3 py-2 pl-9 text-sm outline-none transition-colors focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-200"
                    aria-invalid={Boolean(errors.institution)}
                    {...register("institution")}
                  />
                </div>
                {errors.institution && (
                  <p className="m-0 text-xs text-destructive">{errors.institution.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="block text-xs font-medium text-slate-600">Primary role</Label>
                <div
                  role="tablist"
                  aria-label="Select account role"
                  className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1"
                >
                  {ROLE_OPTIONS.map((option) => {
                    const selected = role === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setValue("role", option.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        aria-pressed={selected}
                        className={cn(
                          "flex items-center justify-center gap-1.5 rounded-md py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-200",
                          selected
                            ? "bg-white text-indigo-600 shadow-sm font-medium"
                            : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        <option.icon
                          className="size-4"
                        />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
                {errors.role && (
                  <p className="m-0 text-xs text-destructive">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className={LABEL_CLASS}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className={cn(
                      "h-auto rounded-lg border px-3 py-2 pr-10 pl-9 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-200",
                      errors.password
                        ? "border-red-400 focus-visible:border-red-400"
                        : "border-slate-200 focus-visible:border-indigo-500"
                    )}
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {password.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 font-semibold",
                          strength.color
                        )}
                      >
                        {strength.score >= 4 && (
                          <CircleCheck className="size-3.5 text-emerald-500" />
                        )}
                        {strength.level}
                      </span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                      {[0, 1, 2, 3].map((index) => (
                        <span
                          key={index}
                          className={cn(
                            "h-1.5 rounded-full transition-colors",
                            index < strength.score ? strength.bar : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="m-0 text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className={LABEL_CLASS}>
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={cn(
                      "h-auto rounded-lg border px-3 py-2 pr-10 pl-9 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-200",
                      passwordsMatch &&
                        "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30",
                      errors.confirmPassword
                        ? "border-red-400 focus-visible:border-red-400"
                        : "border-slate-200 focus-visible:border-indigo-500"
                    )}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    {...register("confirmPassword")}
                  />
                  {passwordsMatch && (
                    <CircleCheck
                      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-emerald-500"
                      aria-label="Passwords match"
                    />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="m-0 text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <div className="flex items-start gap-2.5">
                  <Controller
                    control={control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <Checkbox
                        id="agreeToTerms"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        className="mt-0.5"
                        aria-invalid={Boolean(errors.agreeToTerms)}
                      />
                    )}
                  />
                  <label
                    htmlFor="agreeToTerms"
                  className="cursor-pointer text-sm leading-relaxed text-slate-600"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
                    >
                      Privacy Policy
                    </a>{" "}
                    (FERPA compliant).
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1.5 mb-0 text-xs text-destructive">
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="mt-2 h-auto w-full gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-200"
              >
                Create Account
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <p className="mt-3 mb-1 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SignUpPage
