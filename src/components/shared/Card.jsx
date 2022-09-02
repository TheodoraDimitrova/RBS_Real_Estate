export default function Card({ children, reverse }) {
  return <div className={`card reverse`}>{children}</div>;
}
