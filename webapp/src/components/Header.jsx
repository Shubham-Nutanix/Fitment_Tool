import { NavBarLayout } from "@nutanix-ui/prism-reactjs";

function Header() {
  return (
    <NavBarLayout
      layout={NavBarLayout.NavBarLayoutTypes.LEFT}
      title="SQL Server Fitment Check"
    />
  );
}

export default Header;
