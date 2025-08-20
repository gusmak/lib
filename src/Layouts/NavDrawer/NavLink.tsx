import { forwardRef } from 'react';
import { NavLink as BaseNavLink, NavLinkProps as BaseNavLinkProps } from 'react-router';

const NavLink = forwardRef(({ ...props }: BaseNavLinkProps, ref: React.Ref<HTMLAnchorElement>) => {
    return (
        <BaseNavLink
            ref={ref}
            {...props}
            style={({ isActive }) => ({
                ...(isActive && {
                    borderLeft: `2px solid #ED1D25`,
                    fontWeight: `bold`,
                    marginLeft: '-1px',
                }),
            })}
        />
    );
});

export default NavLink;
