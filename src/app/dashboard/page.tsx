import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardPage from '@/components/Dashboard'

const page = async () => {
    const session = await getServerSession(authOptions)
    return <DashboardPage userEmail={session!.user!.email!}></DashboardPage>
}

export default page
