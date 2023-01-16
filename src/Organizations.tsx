import React from "react";
import {IBundle} from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle";
import {IOrganization} from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization";
import {
    Button,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow
} from "@mui/material";
import Organization from "./Organization";

interface OrganizationsState {
    orgs: IOrganization[],
    total: number,
    page: number
}

export default class Organizations extends React.Component<{}, OrganizationsState> {
    state: OrganizationsState = {
        orgs: [],
        total: 0,
        page: 1
    }

    getData(page = 0) {
        let url = "https://national-directory.fast.hl7.org/fhir/Organization?_count=20&_total=accurate&";
        let skip = 0;

        if (page) {
            skip = page > 1 ? (page - 1) * 20 : 0;
            url += `_getpagesoffset=${skip}&`;
        }

        fetch(url)
            .then(res => res.json())
            .then((result: IBundle) =>  {
                const total = result.total || 0;

                this.setState({
                    orgs: (result.entry || []).map(e => e.resource as IOrganization),
                    total: total,
                    page: (skip / 20) + 1
                });
            });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.orgs.map(o => (
                            <TableRow>
                                <TableCell>{o.id}</TableCell>
                                <TableCell>{o.name}</TableCell>
                                <TableCell align="right">
                                    <Organization orgId={o.id}></Organization>
                                    <Button>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                <Pagination
                                    count={Math.ceil(this.state.total / 20)}
                                    page={this.state.page}
                                    onChange={(event, newPage) => this.getData(newPage)}
                                    variant="outlined" />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }
}
