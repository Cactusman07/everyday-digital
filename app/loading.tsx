import LandingSplashScreen from "@/components/LandingSplashScreen";

// Next.js loading.tsx — automatically shown during route transitions while the next
// page's data is being fetched. Works via React Suspense under the hood. When a user
// clicks a link, this loading UI appears instantly while the destination page's
// server-side data fetching completes.
export default function Loading() {
  return <LandingSplashScreen />;
}
