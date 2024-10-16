import React, { useState, useEffect } from "react";
import { Modal, Box, IconButton, Checkbox } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from "../../components/ListControls";

import SnackbarComponent from "../../components/SnackbarComponent";
import { getGroups, createGroup } from "../../api/superAdmin";
import CreateGroup from "./CreateGroup";
import { Group } from "../../types/Types";


const ListGroups: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
    position: { vertical: "top" as const, horizontal: "center" as const },
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGroups();
      if (response.status && response.resp_code === "SUCCESS") {
        setGroups(response.data);
      } else {
        throw new Error("Failed to fetch groups");
      }
    } catch (err) {
      setError("Failed to load groups. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSave = async (name: string) => {
    try {
      const response = await createGroup(name);
      if (response.status && response.resp_code === "CREATED") {
        const newGroup: Group = {
          ID: Date.now(), // Temporary ID
          Name: name,
        };
        setGroups((prevGroups) => [...prevGroups, newGroup]);
        setSnackbar({
          open: true,
          message: "Group created successfully!",
          severity: "success",
          position: { vertical: "top", horizontal: "center" },
        });
      } else {
        throw new Error(response.data || "Failed to create group");
      }
    } catch (error: any) {
      console.error("Error creating group:", error);
      setSnackbar({
        open: true,
        message: error.response.data.error || "Failed to create group. Please try again.",
        severity: "error",
        position: { vertical: "top", horizontal: "center" },
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    setGroups(groups.filter((group) => group.ID !== id));
    setSelectedGroups(selectedGroups.filter((groupId) => groupId !== id));
    setSnackbar({
      open: true,
      message: "Group deleted successfully!",
      severity: "success",
      position: { vertical: "top", horizontal: "center" },
    });
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((groupId) => groupId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedGroups(filteredGroups.map((group) => group.ID));
    } else {
      setSelectedGroups([]);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
      <ListControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        itemCount={filteredGroups.length}
      />

      {loading ? (
        <div>Loading groups...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : filteredGroups.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-300">
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  <Checkbox
                    checked={selectedGroups.length === filteredGroups.length}
                    onChange={handleSelectAll}
                    indeterminate={
                      selectedGroups.length > 0 &&
                      selectedGroups.length < filteredGroups.length
                    }
                  />
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  SL No
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">
                  Group Name
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group, index) => (
                <tr key={group.ID} className="cursor-pointer">
                  <td className="text-center">
                    <Checkbox
                      checked={selectedGroups.includes(group.ID)}
                      onChange={() => handleCheckboxChange(group.ID)}
                    />
                  </td>
                  <td className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {group.Name}
                    </div>
                  </td>
                  <td className="text-center">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(group.ID)}
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No groups available</div>
      )}

      <div className="fixed bottom-10 right-16 flex items-center space-x-2">
        <button
          className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
          onClick={handleOpenModal}
        >
          <PlusCircle size={34} />
          <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
            Create New Group
          </span>
        </button>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <CreateGroup onSave={handleSave} onCancel={handleCloseModal} />
        </Box>
      </Modal>

      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        position={snackbar.position}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default ListGroups;