import React from "react";

export type BadgeVariant = "success" | "warning" | "critical" | "neutral" | "brand";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ variant, label }) => {
  const getStyles = () => {
    switch (variant) {
      case "success":
        return {
          bg: "bg-[rgba(24,128,56,0.12)]",
          text: "text-status-success",
          dot: "bg-status-success",
        };
      case "warning":
        return {
          bg: "bg-[rgba(245,197,24,0.15)]",
          text: "text-status-warning-text",
          dot: "bg-status-warning-text",
        };
      case "critical":
        return {
          bg: "bg-[rgba(217,48,37,0.12)]",
          text: "text-status-critical",
          dot: "bg-status-critical",
        };
      case "brand":
        return {
          bg: "bg-brand-subtle-bg",
          text: "text-brand",
          dot: null,
        };
      case "neutral":
      default:
        return {
          bg: "bg-bg-secondary",
          text: "text-text-secondary",
          dot: null,
        };
    }
  };

  const styles = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[12px] font-medium ${styles.bg} ${styles.text} whitespace-nowrap`}
    >
      {styles.dot && <span className={`w-1.5 h-1.5 rounded-pill ${styles.dot}`} />}
      <span>{label}</span>
    </span>
  );
};

export default Badge;
