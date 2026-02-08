import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "GestAgro Credit",
  projectId: "demo_project_id",
  chains: [sepolia],
  ssr: false,
});
