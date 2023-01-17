import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import React from "react";
import {IOrganization} from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization";
import DataGrid from "react-data-grid";

interface OrganizationProps {
    org?: IOrganization;
    onClose?: () => void;
}

interface OrganizationRating {
    key: number,
    typeSystem?: string,
    typeCode?: string,
    rating?: string
}

interface OrganizationState {
    open: boolean;
    org?: IOrganization;
    ratings: OrganizationRating[]
}

const baseExtRatingUrl = 'http://hl7.org/fhir/us/ndh/StructureDefinition/base-ext-rating';
const orgDescriptionExtensionUrl = 'http://hl7.org/fhir/us/ndh/StructureDefinition/base-ext-org-description';

export default class Organization extends React.Component<OrganizationProps, OrganizationState> {
    state: OrganizationState = {
        open: false,
        ratings: []
    };

    componentDidMount() {
        const ratings = this.props.org ? Organization.getRatings(this.props.org) : [];

        if (!ratings.length) {
            ratings.push({
                key: ratings.length
            });
        }

        this.setState({
            org: this.props.org,
            ratings
        });
    }

    openDialog() {
        this.setState({
            open: true
        });
    }

    static getRatings(org: IOrganization) {
        if (!org.extension) return [];

        return org.extension.filter(e => {
            return e.url === baseExtRatingUrl;
        })
            .map((e, index) => {
                const type = e.extension?.find(n => n.url === 'ratingType');
                const value = e.extension?.find(n => n.url === 'ratingValue');

                const ret: OrganizationRating = {
                    key: index,
                    typeSystem: type?.valueCodeableConcept?.coding?.at(0)?.system,
                    typeCode: type?.valueCodeableConcept?.coding?.at(0)?.code,
                    rating: value?.valueString
                };
                return ret;
            });
    }

    cancel() {
        this.setState({
            open: false
        });
    }

    save() {
        console.log(this.state.ratings);
    }

    addRating() {
        this.setState({
            ratings: this.state.ratings.concat({
                key: this.state.ratings.length
            })
        });
    }

    get orgDescription() {
        const ext = this.state.org?.extension?.find(e => e.url === orgDescriptionExtensionUrl);
        return ext?.valueString as string;
    }

    set orgDescription(value: string) {
        if (!this.state.org) return;

        const org = this.state.org;
        org.extension = org.extension || [];
        let ext = org.extension.find(e => e.url === orgDescriptionExtensionUrl);

        if (!ext && value) {
            ext = {
                url: orgDescriptionExtensionUrl,
                valueString: value
            };
            org.extension.push(ext);
        } else if (ext && !value) {
            const index = org.extension.indexOf(ext);
            org.extension.splice(index, 1);
        } else if (ext && value) {
            ext.valueString = value;
        }

        this.setState({
            org
        });
    }

    get orgName() {
        return this.state.org?.name as string;
    }

    set orgName(value: string) {
        if (!this.state.org) return;
        const org = this.state.org;
        org.name = value;
        this.setState({
            org
        });
    }

    render() {
        let content;

        const ratingsCols = [{
            key: 'typeSystem',
            name: 'Type System'
        }, {
            key: 'typeCode',
            name: 'Type Code'
        }, {
            key: 'rating',
            name: 'Rating'
        }];

        if (this.state.org) {
            content = (
                <DialogContent sx={{ height: 300 }}>
                    <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField autoFocus type="text" placeholder="Name" label="Id" value={this.state.org.id} InputProps={{ readOnly: true, disabled: true }} />
                        <TextField type="text" placeholder="Name" label="Name" value={this.orgName} onChange={(event) => this.orgName = event.target.value} />
                        <TextField type="text" placeholder="Description" label="Description" value={this.orgDescription} onChange={(event) => this.orgDescription = event.target.value} />

                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Ratings</Typography>
                            <Button color="inherit" onClick={() => this.addRating()}>Add</Button>
                        </Toolbar>

                        <DataGrid
                            columns={ratingsCols}
                            rows={this.state.ratings}
                            rowKeyGetter={(row) => row.key}
                        />
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
