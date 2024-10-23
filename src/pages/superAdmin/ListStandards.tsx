import React, { useState, useEffect } from "react";
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from "../../components/ListControls";
import CreateStandard from "./CreateStandard";
import SnackbarComponent from "../../components/SnackbarComponent";
import { getStandards, createStandard } from "../../api/superAdmin";
import { Standard } from "../../types/Types";


const ListStandards: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStandards, setSelectedStandards] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<string>("list");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
    position: { vertical: "top" as const, horizontal: "center" as const },
  });

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStandards();
      if (response.status && response.resp_code === "SUCCESS") {
        setStandards(response.data);
      } else {
        throw new Error("Failed to fetch standards");
      }
    } catch (err) {
      setError("Failed to load standards. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenModal = (standard: Standard | null) => {
    setEditingStandard(standard);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingStandard(null);
    setOpenModal(false);
  };

  const handleSave = async (
    name: string,
    hasGroup: boolean,
    sequence: number
  ) => {
    try {
      const response = await createStandard(name, hasGroup, sequence);
      if (response.status && response.resp_code === "CREATED") {
        const newStandard: Standard = {
          ID: Date.now(),
          Name: name,
          HasGroup: hasGroup,
          sequence: sequence
        };
        setStandards((prevStandards) => [...prevStandards, newStandard]);
        setSnackbar({
          open: true,
          message: "Standard created successfully!",
          severity: "success",
          position: { vertical: "top", horizontal: "center" },
        });
      } else {
        throw new Error(response.data);
      }
    } catch (error: any) {
      console.error("Error creating standard:", error);
      setSnackbar({
        open: true,
        message: error.response.data.error || "Failed to create standard. Please try again.",
        severity: "error",
        position: { vertical: "top", horizontal: "center" },
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    // For now, we'll just remove it from the local state
    // In a real application, you'd want to call an API to delete the standard
    setStandards(standards.filter((standard) => standard.ID !== id));
    setSnackbar({
      open: true,
      message: "Standard deleted successfully!",
      severity: "success",
      position: { vertical: "top", horizontal: "center" },
    });
  };

  const handleSelectAll = () => {
    setSelectedStandards(
      selectAll ? [] : standards.map((standard) => standard.ID)
    );
    setSelectAll(!selectAll);
  };

  const handleSelectStandard = (id: number) => {
    setSelectedStandards((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const filteredStandards = standards.filter((standard) =>
    standard && standard.Name
      ? standard.Name.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  return (
    <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
      <ListControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode as "list" | "grid"}
        setViewMode={setViewMode}
        itemCount={filteredStandards.length}
      />

      {loading ? (
        <div>Loading standards...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : filteredStandards.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-300">
                <th className="text-center w-1/12">
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  SL No
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">
                  Standard Name
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                  Has Group
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStandards.map((standard, index) => (
                <tr key={standard.ID} className="cursor-pointer">
                  <td className="text-center">
                    <Checkbox
                      checked={selectedStandards.includes(standard.ID)}
                      onChange={() => handleSelectStandard(standard.ID)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </div>
                  </td>
                  <td
                    className="text-center"
                    onClick={() => handleOpenModal(standard)}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {standard.Name}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {standard.HasGroup ? "Yes" : "No"}
                    </div>
                  </td>
                  <td className="text-center">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(standard.ID)}
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
        <div>No standards available</div>
      )}

      <div className="fixed bottom-10 right-16 flex items-center space-x-2">
        <button
          className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
          onClick={() => handleOpenModal(null)}
        >
          <PlusCircle size={34} />
          <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
            Create New Standard
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
          <CreateStandard
            initialData={editingStandard}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
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

export default ListStandards;
