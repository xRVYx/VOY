export default function createContextMenuHandler({ state, report }) {
  return (event) => {
    state.contextmenu += 1;
    report('contextmenu', { count: state.contextmenu });
    event.preventDefault();
  };
}
