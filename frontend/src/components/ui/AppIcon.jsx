import React from 'react';

const AppIcon = ({ component: Component, size = 20, color = '#1F2937', strokeWidth = 2 }) => {
    if (!Component) return null;
    return <Component size={size} color={color} strokeWidth={strokeWidth} />;
};

export default AppIcon;
