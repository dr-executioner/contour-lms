import { colors } from "../../../apps/web/src/constants/colors";

export function AuthFooter({
  children,
  bottomText,
}: {
  children?: React.ReactNode;
  bottomText?: React.ReactNode;
}) {
  return (
    <>
      <div className="mt-6">{children}</div>
      {bottomText ? <div className="mt-6 text-center text-xs" style={{ color: colors.dark.textSubtle }}>{bottomText}</div> : null}
    </>
  );
}
