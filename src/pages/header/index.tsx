interface HeaderProps {
  pre?: string;
}

export default (props: HeaderProps) => {
  const { pre } = props;
  return <div className={`${pre}-header`}>ttt</div>;
};
