import React from 'react';
import './App.css';
import 'react-data-grid/lib/styles.css';
import {Box, Container, Tab, Tabs, Typography} from "@mui/material";
import Organizations from "./Organizations";
import Endpoints from "./Endpoints";
import DynamicRegistration from "./DynamicRegistration";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

export default function App() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

  return (
      <Container maxWidth="lg">
          <h2>National Directory</h2>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
              <Tab label="Organizations" id="tab-0" />
              <Tab label="Endpoints" id="tab-1" />
              <Tab label="Dynamic Registration" id="tab-2" />
          </Tabs>
          <TabPanel value={value} index={0}>
              <Organizations></Organizations>
          </TabPanel>
          <TabPanel value={value} index={1}>
              <Endpoints></Endpoints>
          </TabPanel>
          <TabPanel value={value} index={2}>
              <DynamicRegistration></DynamicRegistration>
          </TabPanel>
      </Container>
  );
}
