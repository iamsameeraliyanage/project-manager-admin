import { useTranslation } from "react-i18next";
import "./PWABadge.css";

import { useRegisterSW } from "virtual:pwa-register/react";
import { Box, Button, Typography } from "@mui/material";
import Card from "../Card/Card";

function PWABadge() {
  // periodic sync is disabled, change the value to enable it, the period is in milliseconds
  // You can remove onRegisteredSW callback and registerPeriodicSync function
  const { t } = useTranslation();

  const period = 0;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  function close() {
    setNeedRefresh(false);
  }

  return (
    <div className="PWABadge" role="alert" aria-labelledby="toast-message">
      {needRefresh && (
        <Card className="PWABadge-toast" padding={"sm"}>
          <Box
            className="PWABadge-message"
            sx={{
              mb: 4,
            }}
          >
            <Typography variant="body1">
              {t(
                "pwaRefreshMessage",
                "New content available, click on reload button to update."
              )}
            </Typography>
          </Box>
          <Box
            className="PWABadge-buttons"
            sx={{
              display: "flex",
              gap: 4,
            }}
          >
            <Button
              variant="outlined"
              className="PWABadge-toast-button"
              onClick={() => close()}
            >
              {t("button_text.close", "Close")}
            </Button>
            <Button
              variant="contained"
              className="PWABadge-toast-button"
              onClick={() => updateServiceWorker(true)}
            >
              {t("reload", "Reload")}
            </Button>
          </Box>
        </Card>
      )}
    </div>
  );
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
