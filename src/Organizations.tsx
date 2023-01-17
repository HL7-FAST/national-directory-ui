import React from "react";
import {IBundle} from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle";
import {IOrganization} from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import Organization from "./Organization";
import {getFhirServerBase} from "./common";

interface OrganizationsState {
    orgs: IOrganization[],
    total: number,
    page: number
}

export default class Organizations extends React.Component<{}, OrganizationsState> {
    state: OrganizationsState = {
        orgs: [],
        total: 0,
        page: 0
    }

    getData(page = 0) {
        let url = `${getFhirServerBase()}/Organization?_count=20&_total=accurate&`;

        if (page) {
            url += `_getpagesoffset=${page * 20}&`;
        }

        fetch(url)
            .then(res => res.json())
            .then((result: IBundle) =>  {
                const total = result.total || 0;

                this.setState({
                    orgs: (result.entry || []).map(e => e.resource as IOrganization),
                    total: total,
                    page
                });
            });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="Table of Organizations">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.orgs.map(o => (
                            <TableRow key={o.id}>
                                <TableCell>{o.id}</TableCell>
                                <TableCell>{o.name}</TableCell>
                                <TableCell align="right">
                                    <Organization org={o}></Organization>
                                    <Button>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[20]}
                                count={this.state.total}
                                page={this.state.page}
                                rowsPerPage={20}
                                onPageChange={(event, newPage) => this.getData(newPage)} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }
}
