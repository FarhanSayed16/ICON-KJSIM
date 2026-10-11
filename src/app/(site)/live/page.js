import LiveClient from './LiveClient';
import { getLiveStreamData } from '@/app/actions/liveStream';

export const metadata = {
  title: 'Live Stream | ICON 2026',
  description: 'Watch the ICON 2026 techfest events live.',
};

export default async function LivePage() {
  const result = await getLiveStreamData();
  const initialData = result.success ? result.data : null;

  return (
    <main>
      <LiveClient initialData={initialData} />
    </main>
  );
}
