//layout.tsx
"use client";
import "@mantine/core/styles.css";
import React from "react";

import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import SessionProvider from "./SessionProvider";


const theme = createTheme({
  primaryColor: "myblue",
  primaryShade: 7,
  defaultRadius: "md",

  fontFamily: "Arial , sans-serif",
  colors: {
    myblue: [
      "#070b91",
      "#070b91",
      "#070b91",
      "#070b91",
      "#070b91",
      "#070b91",
      "#070b91",
      "#070b91",
      "#070b91",
      "#070b91",
    ],
    myred: [
      "#de0020",
      "#de0020",
      "#de0020",
      "#de0020",
      "#de0020",
      "#de0020",
      "#de0020",
      "#de0020",
      "#de0020",
      "#de0020",
    ],
  },
});
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
          <title>Ap-Stock</title>
      </head>
      <body
        style={{
          backgroundColor: "#F5F5F5",
        }}
      >
        <SessionProvider>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications />
            <ModalsProvider>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </ModalsProvider>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
