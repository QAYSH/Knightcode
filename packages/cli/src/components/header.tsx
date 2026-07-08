export function Header() {
    return (
        <box alignItems="center" justifyContent="center" >
            <box flexDirection="row" justifyContent="center" gap={1}>
                <ascii-font font="tiny" text="knight" color={'gray'} />
                <ascii-font font="tiny" text="Code" />
            </box>
            
         
        </box>
    );
};