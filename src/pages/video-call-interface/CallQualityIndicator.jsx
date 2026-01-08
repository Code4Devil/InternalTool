import React from 'react';
import Icon from '../../components/AppIcon';

const CallQualityIndicator = ({ quality, bandwidth, latency, packetLoss }) => {
  const getQualityColor = () => {
    if (quality === 'excellent') return 'text-success';
    if (quality === 'good') return 'text-warning';
    return 'text-error';
  };

  const getQualityIcon = () => {
    if (quality === 'excellent') return 'Wifi';
    if (quality === 'good') return 'Wifi';
    return 'WifiOff';
  };

  const getQualityText = () => {
    if (quality === 'excellent') return 'Excellent';
    if (quality === 'good') return 'Good';
    return 'Poor';
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-background/90 backdrop-blur-sm rounded-xl border border-border p-3 md:p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Icon name={getQualityIcon()} size={20} className={getQualityColor()} />
          <div>
            <p className="text-sm font-medium text-foreground">Connection Quality</p>
            <p className={`text-xs font-semibold ${getQualityColor()}`}>
              {getQualityText()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Bandwidth:</span>
            <span className="text-xs font-medium text-foreground data-text">
              {bandwidth} Mbps
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Latency:</span>
            <span className="text-xs font-medium text-foreground data-text">
              {latency} ms
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Packet Loss:</span>
            <span className="text-xs font-medium text-foreground data-text">
              {packetLoss}%
            </span>
          </div>
        </div>

        {quality === 'poor' && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-start gap-2">
              <Icon name="AlertCircle" size={14} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-xs text-error">
                Poor connection detected. Consider disabling video.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallQualityIndicator;