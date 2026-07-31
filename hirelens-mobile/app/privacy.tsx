import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '../constants/routes';

export default function PrivacyScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.UPLOAD as any);
  }, []);

  return null;
}
