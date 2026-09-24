import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  UserRound,
} from "lucide-react"

// ---------------------------------------------------------------------------
// 1. Types & Schema
// ---------------------------------------------------------------------------
// "Role" is a union type, not a plain string. This means TypeScript will
// reject anything that isn't exactly one of these three values anywhere
// this type is used — e.g. setRole("teacher") would be a compile error
// because the real value is "faculty". Catching that at compile time
// (red squiggly in your editor) is far cheaper than catching it at runtime
// (a bug users hit in production).
type Role = "admin" | "faculty" | "student"

// Zod schema = the single source of truth for what a valid login looks like.
// react-hook-form uses this to validate on submit, and TypeScript infers the
// form's type FROM this schema (see LoginFormValues below) — so the
// validation rules and the TypeScript type can never drift apart.
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
})

// z.infer<typeof loginSchema> reads the shape out of the schema above,
// so LoginFormValues is always: { email: string; password: string; rememberMe: boolean }
// You never write this type by hand and risk it going stale.
type LoginFormValues = z.infer<typeof loginSchema>

// Small, local, typed config for the role tabs — keeps the JSX below clean
// and makes adding a 4th role later a one-line change instead of editing markup.
const ROLE_OPTIONS: { value: Role; label: string; icon: typeof ShieldCheck }[] = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "faculty", label: "Faculty", icon: BookOpen },
  { value: "student", label: "Student", icon: UserRound },
]

export default function LoginPage() {
  const navigate = useNavigate()
  // -------------------------------------------------------------------------
  // 2. Local UI state (useState)
  // -------------------------------------------------------------------------
  // Rule of thumb: useState is for UI-only state that the rest of the app
  // doesn't need to know about. Nobody outside this component cares whether
  // the password is currently masked, so it stays local instead of going
  // into Redux. If you find yourself needing this value in another
  // component, THAT'S the signal to lift it up or move it to global state —
  // not before.
  const [showPassword, setShowPassword] = useState(false)

  // Selected role tab. This IS relevant beyond this component (the submit
  // handler needs it, and eventually your auth API call needs it), but it's
  // still simple synchronous UI state, so useState is still the right tool —
  // it doesn't need to survive a page refresh or be shared across routes.
  const [selectedRole, setSelectedRole] = useState<Role>("admin")

  // -------------------------------------------------------------------------
  // 3. Form state (react-hook-form, NOT useState)
  // -------------------------------------------------------------------------
  // Why not just useState for email/password like a beginner tutorial shows?
  // Because that re-renders the whole component on every keystroke, and you
  // end up hand-writing validation, error messages, and touched/dirty
  // tracking yourself. react-hook-form keeps inputs "uncontrolled" internally
  // (using refs, not state) so typing doesn't trigger re-renders, and it
  // gives you validation, error objects, and submit handling for free.
  const {
    register,        // wires an <input> up to the form without you managing its value/onChange
    handleSubmit,     // wraps your submit function: runs validation first, only calls yours if valid
    formState: { errors, isSubmitting }, // read-only state react-hook-form manages for you
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // tells react-hook-form "validate using this Zod schema"
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  })

  // This only runs after Zod validation passes — `data` is already typed
  // as LoginFormValues, so data.email is guaranteed to be a valid email string
  // by the time you see it here. No manual "is this empty?" checks needed.
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Replace with your actual RTK Query mutation, e.g.:
      // await login({ ...data, role: selectedRole }).unwrap()
      void data
      toast.success("Login successful", { description: `Welcome back! Signed in as ${selectedRole}.` })
      navigate("/dashboard", { replace: true })
    } catch (err) {
      console.error(err)
      toast.error("Unable to sign in", { description: "Please try again." })
    }
  }

  return (
    // h-screen (not min-h-screen) + overflow-hidden is what actually
    // prevents a scrollbar: min-h-screen only sets a FLOOR, so content
    // taller than the viewport still pushes the page down and scrolls.
    // h-screen caps it at exactly the viewport height, no more, no less.
    <div className="h-screen w-full flex items-center justify-center overflow-hidden">
      {/* max-h-[95vh] is the safety net: even if content inside runs a
          little long on a very short/laptop screen, the CARD itself
          never exceeds 95% of the viewport height, so nothing inside
          it can force the page to scroll. */}
      <div className="w-full max-w-4xl max-h-[95vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border-0">
        {/* -------------------------------------------------------------- */}
        {/* LEFT PANEL — branding, hidden on small screens                 */}
        {/* -------------------------------------------------------------- */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base">EduAttend</span>
              <span className="ml-1 text-[9px] tracking-wide bg-white/15 px-2 py-0.5 rounded-full">
                ADMIN &amp; CAMPUS
              </span>
            </div>

            <span className="inline-block mt-4 text-[11px] bg-white/10 px-3 py-1 rounded-full">
              Real-time Attendance &amp; Analytics
            </span>

            {/* Font size uses clamp() so it scales down automatically on
                shorter viewports instead of a single fixed size that's
                always "big" regardless of available height. */}
            <h1
              className="mt-3 text-white font-bold leading-tight"
              style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.875rem)" }}
            >
              Smarter attendance, simplified.
            </h1>

            <p className="mt-2 text-xs text-indigo-100 max-w-xs leading-relaxed">
              Track student presence, coordinate faculty schedules, and manage
              course enrollments across campus — all in one modern workspace.
            </p>

            {/* Small preview card — static decorative content, not live data */}
            <div className="mt-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between text-[11px] text-indigo-100">
                <span>Fall 2024 Overview</span>
                <span className="text-emerald-300">98.2% Sync</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-md p-2">
                  <p className="text-[9px] text-indigo-100">TODAY'S PRESENCE</p>
                  <p className="text-sm font-semibold">92.4%</p>
                </div>
                <div className="bg-white/10 rounded-md p-2">
                  <p className="text-[9px] text-indigo-100">ACTIVE STUDENTS</p>
                  <p className="text-sm font-semibold">1,240</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-indigo-100 pt-4 border-t border-white/10">
            <span>Trusted by 50+ campuses — K-12 schools, colleges &amp; academies</span>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* RIGHT PANEL — the actual form                                  */}
        {/* -------------------------------------------------------------- */}
        {/* overflow-y-auto here (not on the page) means IF this panel's
            content is ever taller than the card on a very small screen,
            only this inner panel scrolls — the page/card frame stays put.
            In practice, with the sizes below, it won't need to. */}
        <div className="w-full md:w-1/2 p-6 sm:p-7 overflow-y-auto">
          {/* Role selector */}
          <p className="text-xs font-medium text-slate-500 mb-1.5">Sign in as:</p>
          <div
            role="tablist"
            aria-label="Select account role"
            className="grid grid-cols-3 gap-1 bg-slate-100 rounded-lg p-1 mb-4"
          >
            {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => {
              const isActive = selectedRole === value
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedRole(value)}
                  className={`flex items-center justify-center gap-1.5 text-sm py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm font-medium"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            })}
          </div>

          <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign in to your EduAttend campus portal
          </p>

          {/* handleSubmit(onSubmit) = "validate first, then call onSubmit if valid" */}
          <form noValidate onSubmit={handleSubmit(onSubmit, (validationErrors) => {
            const firstError = validationErrors.email?.message ?? validationErrors.password?.message ?? "Please complete the required fields."
            toast.error("Check your sign-in details", { description: String(firstError) })
          })} className="mt-4 space-y-3">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-600 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="sarah.jenkins@eduattend.edu"
                  // register("email") returns { name, onChange, onBlur, ref } and
                  // spreading it onto the input is what wires it into react-hook-form.
                  {...register("email")}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-indigo-200 ${
                    errors.email
                      ? "border-red-400 focus:border-red-400"
                      : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              {/* errors.email only exists if Zod's validation failed for this field.
                  TypeScript knows its shape from the schema, so errors.email?.message
                  is safely typed as string | undefined. */}
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-slate-600">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-indigo-200 ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot password row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit button — isSubmitting comes from react-hook-form and is
                true only while onSubmit's async work is in flight, so the
                button disables itself automatically during the API call. */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign In →"}
            </button>

            <p className="text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-600 font-medium hover:underline">
                Create an account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
