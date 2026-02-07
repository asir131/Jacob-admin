
import React from 'react';

const IconBox = (props: { icon: React.ReactNode; className?: string }) => {
    const { icon, className } = props;
    return (
        <div className={`flex items-center justify-center rounded-full ${className}`}>
            {icon}
        </div>
    );
};

export default IconBox;
