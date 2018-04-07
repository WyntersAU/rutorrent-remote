import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";


//print row and check status to return Start/Stop in single menu
export function getRowRenderer(row, onclick,) {
    return (
      <ContextMenuTrigger id={row.value}>
        <span>{row.value}</span>

        <ContextMenu id={row.value}>
          <MenuItem onClick={onclick}> 
            Start
          </MenuItem>
        </ContextMenu>

      </ContextMenuTrigger>
    );
}