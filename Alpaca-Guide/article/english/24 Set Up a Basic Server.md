## 💻Set up your Minecraft server

congratulations! After conquering survival and PvP, it’s time to move towards Minecraft’s ultimate goal: **Create your own world and invite friends to join!**

The Holy Alpaca will take you to complete the **Set up a Java version of Minecraft server** process step by step.

------



### ⚙️ Step 1: Preparation and download



Before you begin, make sure your computer meets the following requirements:

1. **Install Java:** Your computer must be installed with **The latest version of Java**, which is the underlying environment required to run a Minecraft server.
2. **Server file:** Go to the official Minecraft website or the official website of your preferred server to download the **`server.jar`** file that corresponds to the version you want (for example, the official original server or the optimized server such as Paper/Spigot).



### 📂 Step 2: Create a server running environment



1. **Create a new folder:** Create a new folder on your computer (an easy-to-find location) named **"MyMinecraftServer"** or your favorite name.
2. **Put in the file:** Put the **`server.jar`** file you downloaded into this newly created folder.



### 🚀 Step 3: Write a startup script (Start Script)



You need to create a batch file (`.bat` file) to tell the computer how to run this server file in Java.

1. **Create a text document:** In this folder, create a new **Text document (.txt file)**.

2. **Paste the code:** Paste the following startup code in the document:

```bash
java -Xmx2048M -Xms2048M -jar server.jar nogui
pause
   ```

> - **Code description:**
> - `java`: Calls the Java running environment.
> - `-Xmx2048M -Xms2048M`: **Allocate memory**. The setting here is 2048MB (i.e. 2GB). If your computer has sufficient memory, you can allocate more (for example 4GB), but please adjust it according to the actual memory of your computer.
> - `server.jar`: The name of the server file you downloaded.
> - `nogui`: Run in command line mode to save resources.

3. **Save as .bat file:**

   - Click **"document"** -> **"Save As"**.
   - Change **"Save Type"** to **"All Files (\*.\*)"**.
   - Change the file name to **`start.bat`**.



### 🚫 Step 4: Accept the EULA Agreement



Double-click to run the `start.bat` file for the first time, and the server will try to start, but will fail because you do not agree to the license agreement. It generates a `eula.txt` file in the folder.

1. **Open `eula.txt`:** Open the `eula.txt` file with notepad.
2. **Modify the agreement:** Change `eula=false` in the file to **`eula=true`**.
3. **Save the file.**



### 🌐 Step 5: Configuration and final startup



Now, double-click again to run the **`start.bat`** file. The server will officially start running and generate world files.



#### 1. Configure server parameters (server.properties)



When the server is running, you can modify the `server.properties` file to adjust the settings:

- `gamemode=survival`: Set the default game mode.
- `difficulty=easy`: Set the difficulty.
- `max-players=20`: Set the maximum number of players.
- `online-mode=true`: **important!** Make sure to set to `true` to ensure that only genuine users can join.



#### 2. Invite friends to join



- **Join the same computer:** In the Minecraft game, select **"Multiplay"** -> **"Direct Connect"**, enter **`localhost`** or **`127.0.0.1`** to join.
- **Join external friends (port mapping):** **This is the most difficult step!** Your friend needs to enter your **Public network IP address**, and you need:
  - **Port Forwarding in router settings**, open the default port `25565` to the external network.

> **⚠️ Network Security Warning:** There is a security risk for open ports. Please make sure that your system firewall is turned on and only share your public IP address with trusted friends!