-- Core tables
CREATE TABLE Projects (
    ProjectID INT PRIMARY KEY,
    ProjectTitle VARCHAR(255),
    PAASCode VARCHAR(50),
    ApprovalStatusID INT,
    FundID INT,
    PAGValue DECIMAL(15,2),
    StartDate DATE,
    EndDate DATE,
    CountryID INT,
    LeadOrgUnitID INT,
    ThemeID INT,
    TotalExpenditure DECIMAL(15,2),
    TotalContribution DECIMAL(15,2),
    TotalPSC DECIMAL(15,2),
    FOREIGN KEY (ApprovalStatusID) REFERENCES ApprovalStatus(StatusID),
    FOREIGN KEY (FundID) REFERENCES Funds(FundID),
    FOREIGN KEY (CountryID) REFERENCES Countries(CountryID),
    FOREIGN KEY (LeadOrgUnitID) REFERENCES LeadOrgUnits(OrgUnitID),
    FOREIGN KEY (ThemeID) REFERENCES Themes(ThemeID)
);

-- Lookup tables
CREATE TABLE ApprovalStatus (
    StatusID INT PRIMARY KEY AUTO_INCREMENT,
    StatusName VARCHAR(50) UNIQUE
);

CREATE TABLE Funds (
    FundID INT PRIMARY KEY AUTO_INCREMENT,
    FundCode VARCHAR(10) UNIQUE
);

CREATE TABLE Countries (
    CountryID INT PRIMARY KEY AUTO_INCREMENT,
    CountryName VARCHAR(100) UNIQUE
);

CREATE TABLE LeadOrgUnits (
    OrgUnitID INT PRIMARY KEY AUTO_INCREMENT,
    OrgUnitName VARCHAR(255) UNIQUE
);

CREATE TABLE Themes (
    ThemeID INT PRIMARY KEY AUTO_INCREMENT,
    ThemeName VARCHAR(255) UNIQUE
);

-- Many-to-many relationship table
CREATE TABLE ProjectDonors (
    ProjectID INT,
    DonorID INT,
    PRIMARY KEY (ProjectID, DonorID),
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID),
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID)
);

CREATE TABLE Donors (
    DonorID INT PRIMARY KEY AUTO_INCREMENT,
    DonorName VARCHAR(255) UNIQUE
);


-- Populate lookup tables
INSERT INTO ApprovalStatus (StatusName) VALUES
('Approved'), ('Pending Approval');

INSERT INTO Funds (FundCode) VALUES
('FNO'), ('FNE'), ('FOD'), ('FJO'), ('QXB');

-- Insert project data
INSERT INTO Projects (
    ProjectID, ProjectTitle, PAASCode, ApprovalStatusID, 
    FundID, PAGValue, StartDate, EndDate, CountryID, 
    LeadOrgUnitID, ThemeID, TotalExpenditure, TotalContribution, TotalPSC
) VALUES (
    1000, 
    'FSGLO10S05:Youth Empowerment for Urban Development', 
    'H139', 
    (SELECT StatusID FROM ApprovalStatus WHERE StatusName = 'Approved'),
    (SELECT FundID FROM Funds WHERE FundCode = 'FNO'),
    4218607.00, 
    '2012-01-01', 
    '2013-12-31',
    (SELECT CountryID FROM Countries WHERE CountryName = 'GLOBAL'),
    (SELECT OrgUnitID FROM LeadOrgUnits WHERE OrgUnitName = 'Urban Economy'),
    (SELECT ThemeID FROM Themes WHERE ThemeName = 'Urban Economy'),
    4439757.00,
    4329257.00,
    316548.00
);

-- Insert donors
INSERT INTO Donors (DonorName) VALUES 
('BASF Stiftung'), 
('PM of Norway to the United Nations');

-- Link project to donors
INSERT INTO ProjectDonors (ProjectID, DonorID) VALUES
(1000, (SELECT DonorID FROM Donors WHERE DonorName = 'BASF Stiftung')),
(1000, (SELECT DonorID FROM Donors WHERE DonorName = 'PM of Norway to the United Nations'));
