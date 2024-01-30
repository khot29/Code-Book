/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./CodeBookWp.module.scss";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { TextField, PrimaryButton, Dropdown } from "office-ui-fabric-react";
// import CardComponent from "./CardComponent";
// For Users To Upload Image
import { useDropzone } from "react-dropzone";

const textFieldStyles = { fieldGroup: { width: 300 } };
const narrowDropdownStyles = { dropdown: { width: 300 } };

const CrudWithReact = ({ siteUrl, context }) => {
  const [status, setStatus] = useState("Ready");
  const [softwareListItems, setSoftwareListItems] = useState([]);


  const [softwareListItem, setSoftwareListItem] = useState({
    Id: 0,
    Title: "",
    SoftwareName: "",
    SoftwareDescription: "",
    SoftwareVendor: "Select an option",
    SoftwareVersion: "",
  });

  const fetchListItems = async () => {
    try {
      const url = `${siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`;
      console.log({ siteUrl: siteUrl });
      console.log({ url: url });
      const response = await context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );
      const data = await response.json();
      console.log({ data: data });
      data.value = data.value ? data.value : [];

      setSoftwareListItems(data.value);
      console.log({ softwareListItem: softwareListItem });
      setStatus("All Records have been loaded Successfully");
    } catch (error) {
      setStatus(`Error fetching data: ${error.message}`);
    }
  };

  

  const dropdownRef = useRef();
  console.log(status);
  useEffect(() => {
    fetchListItems()
      .then(() => {
        // Data fetched successfully
      })
      .catch((error) => {
        // Handle the error, e.g., set an error state or log the error
        console.error(`Error fetching data: ${error.message}`);
      });
  }, []);

  function bindDetailsList(message: string): void {
    fetchListItems()
      .then(() => {
        // Data fetched successfully
      })
      .catch((error) => {
        // Handle the error, e.g., set an error state or log the error
        console.error(`Error fetching data: ${error.message}`);
      });
  }

  const handleAddClick = () => {
    console.log("Add Working");
    console.log({ softwareListItem: softwareListItem });
    // Implementation for adding a new item
    const url: string =
      siteUrl + "/_api/web/lists/getbytitle('MicrosoftSoftware')/items";

    const spHttpClientOptions: ISPHttpClientOptions = {
      body: JSON.stringify(softwareListItem),
    };

    context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 201) {
          bindDetailsList(
            "Record added and All Records were loaded Successfully"
          );
        } else {
          setStatus("At Error Occured");
        }
      });
  };

  async function handleUpdateClick() {
    // Implementation for updating an item
  }

  const handleDeleteClick = async () => {
    // Implementation for deleting an item
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSoftwareListItem((prevState) => ({ ...prevState, [name]: value }));
  };

  const onVendorChange = (event : any, option : any) => {
    setSoftwareListItem((prevState) => ({
      ...prevState,
      SoftwareVendor: option.text,
    }));
  };

  return (
    <div>
      <TextField
        label="Software Title"
        name="Title"
        required={true}
        value={softwareListItem.Title}
        styles={textFieldStyles}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          handleChange(event);
        }}
      />
      <TextField
        label="Software Name"
        name="SoftwareName"
        required={true}
        value={softwareListItem.SoftwareName}
        styles={textFieldStyles}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          handleChange(event);
        }}
      />
      <TextField
        label="Software Description"
        name="SoftwareDescription"
        required={true}
        value={softwareListItem.SoftwareDescription}
        styles={textFieldStyles}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          handleChange(event);
        }}
      />
      <TextField
        label="Software Version"
        name="SoftwareVersion"
        required={true}
        value={softwareListItem.SoftwareVersion}
        styles={textFieldStyles}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          handleChange(event);
        }}
      />
      <Dropdown
        componentRef={dropdownRef}
        placeholder="Select an option"
        label="Software Vendor"
        options={[
          { key: "Microsoft", text: "Microsoft" },
          { key: "Sun", text: "Sun" },
          { key: "Oracle", text: "Oracle" },
          { key: "Google", text: "Google" },
        ]}
        defaultSelectedKey={softwareListItem.SoftwareVendor}
        required
        styles={narrowDropdownStyles}
        onChange={onVendorChange}
      />
      <PrimaryButton text="Add" onClick={handleAddClick} />
      <PrimaryButton text="Update" onClick={handleUpdateClick} />
      <PrimaryButton text="Delete" onClick={handleDeleteClick} />
      <div id="divStatus">{status}</div>

      {/* <CardComponent softwareListItems={softwareListItems} /> */}
    </div>
  );
};

export default CrudWithReact;


// import * as React from 'react';
// import styles from './CodeBookWp.module.scss';
// import type { ICodeBookWpProps } from './ICodeBookWpProps';
// import { escape } from '@microsoft/sp-lodash-subset';

// export default class CodeBookWp extends React.Component<ICodeBookWpProps, {}> {
//   public render(): React.ReactElement<ICodeBookWpProps> {
//     const {
//       description,
//       isDarkTheme,
//       environmentMessage,
//       hasTeamsContext,
//       userDisplayName
//     } = this.props;

//     return (
//       <section className={`${styles.codeBookWp} ${hasTeamsContext ? styles.teams : ''}`}>
//         <div className={styles.welcome}>
//           <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
//           <h2>Well done, {escape(userDisplayName)}!</h2>
//           <div>{environmentMessage}</div>
//           <div>Web part property value: <strong>{escape(description)}</strong></div>
//         </div>
//         <div>
//           <h3>Welcome to SharePoint Framework!</h3>
//           <p>
//             The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
//           </p>
//           <h4>Learn more about SPFx development:</h4>
//           <ul className={styles.links}>
//             <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
//             <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
//           </ul>
//         </div>
//       </section>
//     );
//   }
// }
