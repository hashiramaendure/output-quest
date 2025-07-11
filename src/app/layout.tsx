import React from "react";
import { DotGothic16 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { baseMetadata } from "@/config/metadata";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { HeroProvider } from "@/contexts/HeroContext";
import CommonContainer from "@/components/common/container/CommonContainer";
import "../styles/globals.css";
import { ControlViewport } from "@/components/layout/control-viewport/ControlViewport";
import { AudioProvider } from "@/contexts/AudioContext";
import { SignOutHandler } from "@/contexts/SignOutHandler";

const dotGothic16 = DotGothic16({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-dot-gothic-16",
	display: "swap",
});

export const metadata: Metadata = {
	...baseMetadata,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const redirectUrl = process.env.NEXT_PUBLIC_CONNECTION_URL || "/connection";
	return (
		<ClerkProvider
			signInFallbackRedirectUrl={redirectUrl}
			signInForceRedirectUrl={redirectUrl}
			signUpFallbackRedirectUrl={redirectUrl}
			signUpForceRedirectUrl={redirectUrl}
			afterSignOutUrl={redirectUrl}
		>
			<html lang="ja" className={`${dotGothic16.variable}`}>
				<body suppressHydrationWarning>
					<SignOutHandler>
						<AudioProvider>
							<HeroProvider>
								<CommonContainer>
									<ControlViewport />
									<Header />
									{children}
									<Footer />
								</CommonContainer>
							</HeroProvider>
						</AudioProvider>
					</SignOutHandler>
				</body>
			</html>
		</ClerkProvider>
	);
}
