# OAR Forecast

**Bisht, Manish**  
**Manager ML**

## Project Overview  
The project involves creating an enterprise-grade forecasting product that can forecast product sales volumes across different hierarchical levels, such as brand, brand-state, and other relevant keys. The deployment process has been streamlined to a one-click operation, consisting of Data Engineering & ML pipelines. Data updates are facilitated through a manual process wherein users upload new data to a specified blob folder. The user can then run the Ingestion pipeline for extraction, transformation, and loading (ETL) data operations. After the ETL pipeline, the user should trigger the ML pipeline which runs data preprocessing, hyperparameter tuning, model training & best model selection. After best model selection, prediction results are saved to a blob which is then consumed by UI.

## Table of Contents:
1. Architecture Diagram.
2. Tech Stack.
3. Environment Details.
4. Developer Flow.
5. Backend.
6. Frontend.
7. Code Structure.
8. CI/CD.
9. Application Performance.
10. Validation Dashboards.
11. Future Improvements.
12. Reference Links.

---

## Architecture Diagram:
![image](https://github.com/user-attachments/assets/a1261146-df69-44a4-9c49-696d67596c5d)


---

## Tech Stack:
The chosen technology stack has been meticulously curated with a strong emphasis on ensuring code quality that aligns with key principles: reproducibility, extensibility, and scalability. The architecture is designed to facilitate a seamless one-click deployment, emphasizing efficiency and ease of use.

| **Feature**               | **Tool/Technology**          |
|---------------------------|------------------------------|
| **Compute**                | Databricks                   |
| **Code Packaging**         | Databricks Bundles           |
| **Workflows/DAG**          | Databricks Workflows         |
| **CI/CD & Code Management**| Azure DevOps CI/CD & Azure Repos |
| **Coding Language**        | Python, React                |
| **Scaling Jobs**           | Joblibspark                  |
| **Hyperparameter Tuning**  | Optuna                       |
| **Storage**                | Blob Storage                 |
| **Database**               | MongoDB                      |
| **User Interface**         | React                        |

---

## Environment Details:
- **Machine Type:** Worker: Standard_D64s_v3
- **Max Number of Workers:** 15

---

## Developer Flow:

### Backend  
**Workflow/ DAG:**
![image](https://github.com/user-attachments/assets/50ae26ae-f758-4370-8c31-7b5eae453f15)


### Code Flow:
![image](https://github.com/user-attachments/assets/97974611-35fe-4459-9bd8-437614e0965f)


**Data Ingestion:**
- Databricks job is scheduled to run daily, and 3 datasets with a combination of view & ledger are placed in the blob path.
- Two tasks are defined to run either as Full or Incremental load ingestion.
- Job level parameters to govern the overall pipeline run.
- Jinja template to parameterize the query and render it dynamically at runtime.
- Pre-defined parameters to differentiate between 'debug' and 'release' runs:
  - `debug` - `is_release=False` (Default)
  - `release` - `is_release=True`
- Skip the entire run using False value in case ingestion is not required:
  - `full_load=False`
  - `incremental_load=False` (Default)

### ML Pipeline:

**Preprocessing:**
- Data cleaning and outlier treatment (zero removal, state name correction, missing date augmentation).
- Data aggregation (date level).
- Modeling data preparation (hierarchical data aggregation).

**Modeling:**
- Train-Val data creation (depending on time series length).
- Hyperparameter tuning (Optuna).
- Model training (Darts library).

**Modeling Algorithms:**
- Statistical models: Sarima, Prophet, Xgboost, Randomforest, FFT, FourTheta, TBATS, KalmanForecaster, Croston.
- DL Models: NHiTSModel, TiDEModel.

**Prediction:**
- Volume forecast.
- KPI calculation (RMSE, MAPE, sMAPE, MdAPE).
- UI data preparation.
- Metric calculation.
- Upload UI data.

---

## Code Directory Structure:

azure-pipelines/
├── prod/            # Yaml files to run CI/CD
src/                 # Main source code
resources/           # YAML files to create Databricks workflows
run.py               # Routes requests to respective workflows
config.yaml          # All variables used in code defined here


## Validation Dashboards

### Data Flow to Update the Accuracy Tracker Dashboard:

1. An Excel file is uploaded to a storage account.
2. The workflow is initiated.
3. The Excel file is merged with the `agg_combination` and ledger file.
4. The accuracy tracker dashboard is refreshed.
5. Databricks triggers Data Factory.
6. Data Factory integrates with a Logic App.
7. The Logic App retrieves the updated dashboard Excel file from the storage account.
8. The refreshed file is stored in a SharePoint folder.
9. An email containing a link to the file location is generated as the output.

![image](https://github.com/user-attachments/assets/ee3e99d3-62e2-4529-b88d-247043d1cb4c)


---

## Frontend

We are using **ReactJS** for our frontend, **FastAPI** as the backend, and **MongoDB** for storing the data.

![image](https://github.com/user-attachments/assets/faba0fe4-4a58-4613-a995-5890ef9b14ae)


- We create JSON files from the prediction generated through the pipeline and store them on Blob.
- Then, we use the **Azure Data Factory Pipeline** to copy the JSON files from Blob to MongoDB.
- The frontend and backend application is hosted on Kubernetes, while MongoDB is deployed using **Azure Cosmos DB**.

---

## KPIs

- Brand
- Sub-state
- Brand Variant
- Size
- Export CSV
- Download All
- Ag Grid Table
- Collapse/Expand Table
- Ag Chart
- **Forecast Tab**:
  - 3 Month Accuracy
  - Model Accuracy
  - Best Model
- **Model Tab**:
  - Top 2 model details

---

### Features:
- Admin login page.
- Dynamic results on table and charts based on the left panel KPI selection.
  ![image](https://github.com/user-attachments/assets/95f67c35-d8a8-4853-8287-499e9ebbd304)

