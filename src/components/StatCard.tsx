import React from "react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle }) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === "number") {
      return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
    return val;
  };

  return (
    <div className='stat-card'>
      <div className='stat-card-header'>
        {icon && <span className='stat-card-icon'>{icon}</span>}
        <h3 className='stat-card-title'>{title}</h3>
      </div>
      <div className='stat-card-value'>{formatValue(value)}</div>
      {subtitle && <div className='stat-card-subtitle'>{subtitle}</div>}
    </div>
  );
};

export default StatCard;
