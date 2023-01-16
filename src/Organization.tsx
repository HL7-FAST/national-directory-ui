import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React from "react";
import {IOrganization} from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization";

interface OrganizationProps {
    orgId?: string;
    onClose?: () => void;
}

interface OrganizationState {
    open: boolean;
    org?: IOrganization;
}

export default class Organization extends React.Component<OrganizationProps, OrganizationState> {
    state: OrganizationState = {
        open: false
    };

    componentDidMount() {
        fetch(`https://national-directory.fast.hl7.org/fhir/Organization/${this.props.orgId}`)
            .then(res => res.json())
            .then((result: IOrganization) => {
                this.setState({
                    org: result
                });
            });
    }

    openDialog() {
        this.setState({
            open: true
        });
    }

    cancel() {
        this.setState({
            open: false
        });
    }

    save() {

    }

    render() {
        let content;

        if (this.state.org) {
            content = (
                <DialogContent>
                    <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField autoFocus type="text" placeholder="Name" label="Id" value={this.state.org.id} InputProps={{ readOnly: true, disabled: true }} />
                        <TextField autoFocus type="text" placeholder="Name" label="Name" value={this.state.org.name} />
                    </Box>
                </DialogContent>
            );
        }

        return (
            <>
                <Button onClick={() => this.openDialog()}>Edit</Button>
                <Dialog fullWidth={true} open={this.state.open} onClose={() => this.cancel()}>
                    <DialogTitle>Edit Organization</DialogTitle>
                    {content}
                    <DialogActions>
                        <Button onClick={() => this.save()}>Save</Button>
                        <Button onClick={() => this.cancel()}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}
