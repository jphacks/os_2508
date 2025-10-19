-- データベース作成
CREATE DATABASE IF NOT EXISTS db_for_arrow;
USE db_for_arrow;

-- Profiles
CREATE TABLE IF NOT EXISTS Profiles (
    UserID VARCHAR(50) PRIMARY KEY,
    Nickname VARCHAR(50),
    Graduation INT,
    Organization VARCHAR(100),
    isOrganizer INT,
    Birthday DATE,
    Comment TEXT
);

-- Identify
CREATE TABLE IF NOT EXISTS Identify (
    UserID VARCHAR(50) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Profiles(UserID)
);

-- Events
CREATE TABLE IF NOT EXISTS Events (
    EventID VARCHAR(50) PRIMARY KEY,
    EventName VARCHAR(100) NOT NULL,
    StartDateTime TIMESTAMP,
    EndDateTime TIMESTAMP,
    Place VARCHAR(255),
    Method VARCHAR(50),
    EntryFee INT,
    Introduction TEXT,
    Sponsor VARCHAR(255),
    Discord VARCHAR(255),
    Target VARCHAR(255),
    Contact VARCHAR(255),
    ApplicationLimit TIMESTAMP,
    CancelLimit TIMESTAMP,
    Proposal JSON
);

-- AttendLogs
CREATE TABLE IF NOT EXISTS AttendLogs (
    AttendLogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID VARCHAR(50) NOT NULL,
    EventID VARCHAR(50) NOT NULL,
    isStaff INT,
    Status INT,
    FOREIGN KEY (UserID) REFERENCES Profiles(UserID),
    FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

-- Schedules
CREATE TABLE IF NOT EXISTS Schedule (
    ScheduleID INT AUTO_INCREMENT PRIMARY KEY,
    EventID VARCHAR(50) NOT NULL,
    Date DATE,
    Time TIME,
    Content TEXT,
    FOREIGN KEY (EventID) REFERENCES Events(EventID)
);
