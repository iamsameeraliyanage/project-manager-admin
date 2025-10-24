import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardActionArea as MuiCardActionArea,
  type Theme,
  CardHeader,
} from "@mui/material";
import { Link } from "react-router-dom";
import { calculatedRem } from "../../theme/ThemeProvider";

type CardContentPadding = "xs" | "sm" | "md" | "lg" | number;
type CardBorderRadius = "xs" | "sm" | "md" | "lg" | number;
type CardVariant = "elevation" | "outlined";
type CardBgColor = "white" | "grey" | "blue";
type OutlineDashed = "primary" | "secondary" | "none";

function calculatePadding(padding: CardContentPadding) {
  return padding === "xs"
    ? calculatedRem(8)
    : padding === "sm"
      ? calculatedRem(16)
      : padding === "md"
        ? calculatedRem(24)
        : padding === "lg"
          ? calculatedRem(32)
          : `${padding}px`;
}
function calculateBorderRadius(borderRadius: CardContentPadding) {
  return borderRadius === "xs"
    ? "3px"
    : borderRadius === "sm"
      ? "5px"
      : borderRadius === "md"
        ? "8px"
        : borderRadius === "lg"
          ? "12px"
          : `${borderRadius}px`;
}

function getBgColor(bgColor: CardBgColor, theme: Theme) {
  return bgColor === "white"
    ? theme.palette.common.white
    : bgColor === "blue"
      ? theme.palette.primary.light
      : theme.palette.secondary.light;
}

interface CustomCardContentProps {
  padding: CardContentPadding;
  children: React.ReactNode;
  fullHeight: boolean;
  testId?: string;
}
function CustomCardContent({
  fullHeight,
  padding,
  children,
  testId,
}: CustomCardContentProps) {
  return (
    <MuiCardContent
      sx={{
        padding: () => calculatePadding(padding),
        "&:last-child": {
          paddingBottom: () => calculatePadding(padding),
        },
        ...(fullHeight && {
          height: "100%",
          overflow: "auto",
        }),
      }}
      data-testid={testId}
    >
      {children}
    </MuiCardContent>
  );
}

interface CustomCardProps {
  bgColor: CardBgColor;
  borderRadius: CardBorderRadius;
  variant: CardVariant;
  children: React.ReactNode;
  disabled?: boolean;
  isActionArea?: boolean;
  fullHeight: boolean;
  dashedBorder: OutlineDashed;
  sx?: any;
  className: string;
  testId?: string;
  active?: boolean;
  bgActive?: boolean;
}

function CustomCard({
  bgColor,
  borderRadius,
  children,
  variant,
  disabled = false,
  isActionArea = false,
  fullHeight,
  dashedBorder,
  sx = {},
  className,
  testId,
  active,
  bgActive,
}: CustomCardProps) {
  return (
    <MuiCard
      variant={variant}
      className={className}
      sx={{
        borderRadius: calculateBorderRadius(borderRadius),
        transition: "all 0.3s",
        ...(fullHeight && {
          height: "100%",
        }),
        ...(dashedBorder === "primary" && {
          borderStyle: "dashed",
          borderColor: (theme) => theme.palette.primary.main,
        }),
        ...(dashedBorder === "secondary" && {
          borderStyle: "dashed",
          borderColor: (theme) => theme.palette.secondary.light,
        }),
        ...(disabled
          ? {
              pointerEvents: "none",
              opacity: 0.5,
              backgroundColor: "#F3F9FF",
            }
          : {
              backgroundColor: (theme) => getBgColor(bgColor, theme),
              ...(bgColor === "grey" && {
                boxShadow: "none",
              }),
              "&:hover": {
                pointerEvents: disabled ? "none" : "auto",
                ...(isActionArea && {
                  boxShadow:
                    variant === "elevation"
                      ? "0px 1px 20px 0px rgba(17, 23, 44, 0.10), 0px 0px 0px 1px #0683DE"
                      : "0px 1px 20px 0px rgba(29, 32, 40, 0.10), 0px 0px 0px 1px #0683DE",
                }),
                backgroundColor: (theme) =>
                  isActionArea ? "#F3F9FF" : getBgColor(bgColor, theme),
              },
            }),
        ...(active && {
          pointerEvents: disabled ? "none" : "auto",
          ...(isActionArea && {
            boxShadow:
              variant === "elevation"
                ? "0px 1px 20px 0px rgba(17, 23, 44, 0.10), 0px 0px 0px 1px #0683DE"
                : "0px 1px 20px 0px rgba(29, 32, 40, 0.10), 0px 0px 0px 1px #0683DE",
          }),
          backgroundColor: (theme) =>
            isActionArea ? "#F3F9FF" : getBgColor(bgColor, theme),
        }),
        ...(bgActive && {
          backgroundColor: (theme) =>
            `${theme.palette.primary.light} !important`,
          borderColor: (theme) => `${theme.palette.primary.main}  !important`,
        }),
        ...sx,
      }}
      aria-disabled={disabled}
      data-testid={testId}
    >
      {children}
    </MuiCard>
  );
}

interface CardProps {
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardContentPadding;
  borderRadius?: CardBorderRadius;
  bgColor?: CardBgColor;
  fullHeight?: boolean;
  title?: string;
  dashedBorder?: OutlineDashed;
  sx?: any;
  className?: string;
  testId?: string;
  active?: boolean;
  bgActive?: boolean;
}

function Card({
  onClick,
  href,
  children,
  variant = "outlined",
  padding = "md",
  disabled = false,
  borderRadius = "sm",
  bgColor = "white",
  fullHeight = false,
  title,
  dashedBorder = "none",
  sx,
  className = "",
  testId,
  active = false,
  bgActive = false,
}: CardProps) {
  const fullId = `${testId}-card`;
  if (href || onClick) {
    const actionProps = href ? { component: Link, to: href } : { onClick };
    return (
      <CustomCard
        variant={variant}
        borderRadius={borderRadius}
        bgColor={bgColor}
        disabled={disabled}
        isActionArea
        fullHeight={fullHeight}
        dashedBorder={dashedBorder}
        sx={sx}
        className={className}
        testId={fullId}
        active={active}
        bgActive={bgActive}
      >
        <MuiCardActionArea
          disableRipple
          disableTouchRipple
          {...actionProps}
          disabled={disabled}
          sx={{
            ...(fullHeight && { height: "100%" }),
            "& .MuiCardActionArea-focusHighlight": {
              display: "none",
            },
          }}
          data-testid={`${fullId}-action-area`}
        >
          {title && (
            <CardHeader
              sx={{ pb: 0 }}
              title={title}
              data-testid={`${fullId}-header`}
            />
          )}
          <CustomCardContent
            fullHeight={fullHeight}
            padding={padding}
            testId={`${fullId}-cardContent`}
          >
            {children}
          </CustomCardContent>
        </MuiCardActionArea>
      </CustomCard>
    );
  }

  return (
    <CustomCard
      variant={variant}
      borderRadius={borderRadius}
      bgColor={bgColor}
      isActionArea={false}
      fullHeight={fullHeight}
      dashedBorder={dashedBorder}
      sx={sx}
      className={className}
      testId={fullId}
    >
      {title && (
        <CardHeader
          sx={{ pb: 0 }}
          title={title}
          data-testid={`${fullId}-header`}
        />
      )}
      <CustomCardContent
        fullHeight={fullHeight}
        padding={padding}
        testId={`${fullId}-cardContent`}
      >
        {children}
      </CustomCardContent>
    </CustomCard>
  );
}

export default Card;
