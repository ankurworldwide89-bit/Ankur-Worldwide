// A template re-mounts on every navigation, so the entrance animation replays on each click.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
