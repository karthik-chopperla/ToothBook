import { redirect } from 'next/navigation'
import { ClinicLocaleProvider } from '@/components/i18n/clinic-locale-provider'
import OnboardingForm from '@/components/onboarding/onboarding-form'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function OnboardingPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/login?callbackUrl=%2Fonboarding')
  }

  const hospitalId = (session.user as { hospitalId?: string }).hospitalId
  const hospital = hospitalId
    ? await prisma.hospital.findUnique({
        where: { id: hospitalId },
        select: { currency: true, onboardingCompleted: true },
      })
    : null

  if (!hospital) {
    redirect('/login')
  }

  if (hospital.onboardingCompleted) {
    redirect('/dashboard')
  }

  return (
    <ClinicLocaleProvider currency={hospital.currency}>
      <OnboardingForm />
    </ClinicLocaleProvider>
  )
}
