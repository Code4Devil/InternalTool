import React from 'react';
import Icon from '../../../components/AppIcon';

const BrandingHeader = () => {
  return (
    <div className="text-center space-y-3 md:space-y-4 lg:space-y-5">
      <div className="flex justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-primary rounded-2xl flex items-center justify-center shadow-elevation-2">
          <Icon name="Zap" size={40} color="var(--color-primary-foreground)" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
          TeamSync
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
          Enterprise Team Collaboration Platform
        </p>
      </div>
    </div>
  );
};

export default BrandingHeader;