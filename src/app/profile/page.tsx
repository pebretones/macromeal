import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { ACTIVITY_LEVELS, GOALS } from "@/lib/calories";
import { ProfileForm } from "./form";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await db.profile.findUnique({ where: { userId: user.id } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">Your profile</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          We compute your daily calorie target using the Mifflin-St Jeor formula, then adjust for your goal.
        </p>
      </div>

      <div className="card p-5 sm:p-8">
        <ProfileForm
          initial={profile}
          activityLevels={Object.entries(ACTIVITY_LEVELS).map(([value, { label }]) => ({ value, label }))}
          goals={Object.entries(GOALS).map(([value, { label }]) => ({ value, label }))}
        />
      </div>
    </div>
  );
}
