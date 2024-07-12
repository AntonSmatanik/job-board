import { fetchProfileAction } from "@/actions";
import { currentUser } from "@clerk/nextjs/server";
import Header from "../header";
import { ThemeProvider } from "../theme-provider";

const CommonLayout = async ({ children, ...props }) => {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <Header
          profileInfo={profileInfo}
          user={JSON.parse(JSON.stringify(user))}
        />

        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default CommonLayout;
