# coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname', 'expected'), [
    (293, ',', {"value": {
        "flag2": ["CT001_CTPower", "Plant001_Cool_GroupEnergyD", "Accum_CT003_CTEnergy", "L30S2_AHUN_returnAirHumidity",
                  "L29_Chiller3_System3CondenserTemp", "L29_Chiller3_System3EvaporatorTemp", "Accum_Plant001_Energy",
                  "Plant001_Heat_GroupEnergyD", "SCHWP001_PumpPower", "PCHWP001_PumpEnergy_W",
                  "L29_Chiller1_System2EvaporatorTemp", "Plant001_GroupPower", "PCHWP002_PumpPower",
                  "Accum_CT031_CTEnergy", "Accum_CHWP002_PumpPower", "L29_Chiller3_CondenserAppT",
                  "PCHWP003_PumpEnergy_W", "Accum_CHWP002_PumpEnergy", "L29_Chiller2_System1EvaporatorTemp",
                  "Accum_Ch002_ChEnergy", "Accum_CHWP004_PumpEnergy", "CT004_CTPower", "Plant001_GroupEnergyD",
                  "SCHWPGroup_GroupPower", "CWP001_PumpPower", "L29_Chiller2_System2EvaporatorTemp",
                  "Accum_CHWP003_PumpEnergy", "HWP001_PumpPower", "CT003_CTPower", "CHWP001_PumpPower",
                  "Accum_Ch003_ChEnergy", "tSet", "Accum_HWP001_PumpEnergy", "HWP003_PumpPower",
                  "L29_Chiller2_System2CondenserTemp", "L29_Chiller2_CondenserAppT", "ChGroup_GroupPower",
                  "PCHWPGroup_GroupPower", "web_outdoorWetTemp", "Accum_HWP002_PumpEnergy", "HWPGroup_GroupPower",
                  "ChGroupTotal001_MaxChEvapAppT", "Plant001_Cool_Load", "Accum_PCHWP003_PumpEnergy",
                  "L30S1_AHUN_returnAirHumidity", "CHWPGroup_GroupPower", "CT032_CTPower",
                  "L29_Chiller2_EvaporatorAppT", "Accum_HWP004_PumpEnergy", "CTSTG2_fanRunNumber",
                  "Accum_PCHWP002_PumpPower", "Plant001_Heat_GroupPower", "Accum_CT004_CTEnergy",
                  "Accum_CHWP001_PumpEnergy", "CWP002_PumpPower", "HWP002_PumpPower", "Plant001_Heat_Load",
                  "Accum_PCHWP003_PumpRunTime", "PCHWP002_PumpEnergy_W", "L29_Chiller2_System1CondenserTemp",
                  "Accum_CHWP003_PumpRunTime", "Accum_CWP001_PumpEnergy", "L29_Chiller1_EvaporatorAppT",
                  "Equip_IntactRate", "CHWsupplyTemp_avg_running", "Accum_Plant001_Cool_GroupEnergy",
                  "Accum_CHWP002_PumpRunTime", "Accum_CWP002_PumpEnergy", "Accum_CWP003_PumpEnergy",
                  "Accum_SCHWP001_PumpEnergy", "Accum_CHWP004_PumpRunTime", "L16S2_AHU2B_returnAirDamper",
                  "Accum_PCHWP002_PumpRunTime", "PCHWP001_PumpPower", "Accum_PCHWP001_PumpRunTime",
                  "Accum_CHWP004_PumpPower", "CHWP001_PumpEnergy_W", "Accum_CHWP001_PumpRunTime", "ChW_AveSupplyT",
                  "Accum_PCHWP001_PumpPower", "L29_Chiller3_EvaporatorAppT", "L29_Chiller1_System1CondenserTemp",
                  "CWPGroup_GroupPower", "L29_Chiller1_System2CondenserTemp", "CWP003_PumpPower",
                  "L16S2_AHU2B_OADampers", "CHWP004_PumpEnergy_W", "L29_Chiller1_CondenserAppT",
                  "CHWreturnTemp_avg_running", "Accum_PCHWP001_PumpEnergy", "Accum_CHWP001_PumpPower",
                  "L29_Chiller3_System2EvaporatorTemp", "Accum_Plant001_Cool_Load", "CTSTG1_fanRunNumber",
                  "L29_Chiller1_System1EvaporatorTemp", "Accum_Plant001_Heat_GroupEnergy", "Accum_Ch001_ChEnergy",
                  "PCHWP003_PumpPower", "Accum_CT001_CTEnergy", "CHWP002_PumpEnergy_W", "CT031_CTPower",
                  "CT002_CTPower", "Accum_HWP003_PumpEnergy", "CHWP004_PumpPower", "Accum_CT032_CTEnergy",
                  "ChW_AveReturnT", "ChGroup_RunNum", "L29_Chiller3_System2CondenserTemp", "tInterval",
                  "CHWP003_PumpPower", "CHWP002_PumpPower", "Accum_PCHWP002_PumpEnergy", "Accum_CHW_RunState",
                  "CTGroup_GroupPower", "coolHeat", "CHW_RunState", "ChGroupTotal001_MaxChCondAppT",
                  "Accum_PCHWP003_PumpPower", "Accum_CHWP003_PumpPower", "HWP004_PumpPower",
                  "L30S1_AHUW_returnAirHumidity", "Plant001_Cool_GroupPower", "CHWP003_PumpEnergy_W",
                  "Accum_CT002_CTEnergy"],
        "flag0": ["L1S2_AHU2_outsideAirTemp", "VAV_L19S1_UnderCoolRoomCount_svr", "L29_CHWP2_ReturnTemp",
                  "L29_HWP2_Enable", "VAV_L6S1_AboveTIntervalRoomCount_svr", "VAV_L15S1_OverHeatRoomCount_svr",
                  "VAV_L29S1_TSetTooHotRoomCount_svr", "L14S2_AHU2_OADampers", "VAV_L23S2_OverHeatRoomCount_svr",
                  "VAV_L17S1_OverHeatRoomCount_svr", "L29_Chiller1_Status", "VAV_L3S2_TSetTooHotRoomCount_svr",
                  "L29_Chiller1_System1EvaporatorPressure", "VAV_L20S1_TSetTooColdRoomCount_svr",
                  "L2S1_AHU1_returnAirDamper", "VAV_L15S1_TSetTooHotRoomCount_svr", "L14S2_AHU2_returnAirDamper",
                  "roof_CTFan3_OnOff", "L3S2_AHU2_OADampers", "VAV_L30S2_AboveTIntervalRoomCount_svr",
                  "VAV_L21S1_OverHeatRoomCount_svr", "VAV_L21S1_TSetTooColdRoomCount_svr",
                  "VAV_L28S2_UnderCoolRoomCount_svr", "VAV_L29S2_BelowTIntervalRoomCount_svr",
                  "VAV_L23S1_TSetTooColdRoomCount_svr", "VAV_L1S1_TSetTooColdRoomCount_svr",
                  "VAV_L11S1_AboveTIntervalRoomCount_svr", "VAV_L2S1_UnderCoolRoomCount_svr", "L5S2_AHU2_StopHeat",
                  "VAV_L17S2_OverHeatRoomCount_svr", "VAV_L8S1_TSetTooColdRoomCount_svr",
                  "VAV_L5S1_BelowTIntervalRoomCount_svr", "VAV_L4S1_BelowTIntervalRoomCount_svr",
                  "VAV_L2S2_OverHeatRoomCount_svr", "L14S1_AHU1_OADampers", "VAV_L15S2_UnderCoolRoomCount_svr",
                  "VAV_L11S2_UnderCoolRoomCount_svr", "L30S2_AHUC_OADampers", "L30S1_AHUC_OADampers",
                  "L15S1_AHU1B_OADampers", "VAV_L30S1_TSetTooColdRoomCount_svr", "L9S1_AHU1_OADampers",
                  "VAV_L29S1_TSetTooColdRoomCount_svr", "VAV_L1S1_OverHeatRoomCount_svr", "L29_Boiler2_SupplyT",
                  "VAV_L4S2_TSetTooHotRoomCount_svr", "VAV_L16S2_TSetTooHotRoomCount_svr",
                  "VAV_L23S1_UnderCoolRoomCount_svr", "VAV_L21S2_TSetTooHotRoomCount_svr",
                  "VAV_L15S2_TSetTooHotRoomCount_svr", "L29_Chiller3_System3CondenserPressure",
                  "VAV_L12S1_OverHeatRoomCount_svr", "VAV_L5S1_TSetTooHotRoomCount_svr", "L10S2_AHU2_returnAirDamper",
                  "VAV_L13S1_UnderCoolRoomCount_svr", "L11S1_AHU1_OADampers", "VAV_L20S1_AboveTIntervalRoomCount_svr",
                  "L30S2_AHUN_OADampers", "L29_SCHWP1_SupplyTemp", "L29_Chiller1_System2CondenserPressure",
                  "L30S2_AHUN_returnAirDamper", "L12S1_AHU1_OADampers", "VAV_L10S2_AboveTIntervalRoomCount_svr",
                  "L2S2_AHU2_returnAirDamper", "L29_Boiler1_Enable", "VAV_L7S2_OverHeatRoomCount_svr",
                  "VAV_L13S2_TSetTooHotRoomCount_svr", "VAV_L14S2_TSetTooHotRoomCount_svr", "L13S2_AHU2_OADampers",
                  "L29_Chiller2_System1CondenserPressure", "VAV_L15S1_UnderCoolRoomCount_svr",
                  "VAV_L9S1_UnderCoolRoomCount_svr", "L1S1_AHU1_chilledWaterValve", "roof_CTFan32_Enable",
                  "L29_SCHWP1_Enable", "VAV_L6S2_BelowTIntervalRoomCount_svr", "VAV_L2S1_OverHeatRoomCount_svr",
                  "VAV_L4S1_TSetTooColdRoomCount_svr", "VAV_L13S2_OverHeatRoomCount_svr",
                  "VAV_L8S2_TSetTooHotRoomCount_svr", "L30S1_AHUS_returnAirDamper",
                  "VAV_L18S1_BelowTIntervalRoomCount_svr", "VAV_L11S2_TSetTooColdRoomCount_svr", "L29_CHWP4_Enable",
                  "VAV_L8S2_OverHeatRoomCount_svr", "L3S2_PAC2_CLGLOOP", "L29_Chiller2_CWLeavingTemp_HL",
                  "roof_CTFan31_SPD", "L29_Chiller3_System3EvaporatorPressure", "VAV_L5S2_AboveTIntervalRoomCount_svr",
                  "VAV_L5S2_BelowTIntervalRoomCount_svr", "VAV_L7S2_BelowTIntervalRoomCount_svr",
                  "VAV_L18S2_OverHeatRoomCount_svr", "VAV_L30S2_TSetTooColdRoomCount_svr",
                  "VAV_L5S1_AboveTIntervalRoomCount_svr", "L29_Chiller2_System1EvaporatorPressure",
                  "L10S1_AHU1_OADampers", "L8S1_AHU1_OADampers", "L15S2_AHU2A_OADampers", "L11S1_AHU1_returnAirDamper",
                  "VAV_L30S1_UnderCoolRoomCount_svr", "L12S1_AHU1_averageSetPoint", "L29_HWP1_Enable",
                  "VAV_L10S2_TSetTooColdRoomCount_svr", "L29_HWP3_Enable", "VAV_L2S2_BelowTIntervalRoomCount_svr",
                  "L29_Chiller1_CHWsupplyTemp_LWT_HL", "VAV_L29S2_UnderCoolRoomCount_svr",
                  "VAV_L13S2_AboveTIntervalRoomCount_svr", "L2S2_AHU2_OADampers", "VAV_L21S2_OverHeatRoomCount_svr",
                  "L29_CHWP2_Status", "L4S2_AHU2_OADampers", "VAV_L19S2_UnderCoolRoomCount_svr", "L29_CHWP4_Speed",
                  "VAV_L11S2_TSetTooHotRoomCount_svr", "VAV_L3S2_BelowTIntervalRoomCount_svr", "L30S1_AHUE_OADamperMin",
                  "L30S2_AHUW_returnAirHumidity", "VAV_L19S1_TSetTooColdRoomCount_svr",
                  "VAV_L16S2_OverHeatRoomCount_svr", "VAV_L10S1_AboveTIntervalRoomCount_svr",
                  "VAV_L11S1_OverHeatRoomCount_svr", "VAV_L3S2_AboveTIntervalRoomCount_svr",
                  "VAV_L13S1_BelowTIntervalRoomCount_svr", "VAV_L30S2_OverHeatRoomCount_svr", "L30S1_AHUC_OADamperMin",
                  "L30S2_AHUS_fanEnable", "VAV_L8S1_UnderCoolRoomCount_svr", "L29_PCHWP3_Enable",
                  "L13S1_AHU1_OADampers", "L29_CWP3_Speed", "L16S2_AHU2A_returnAirDamper",
                  "VAV_L16S1_TSetTooColdRoomCount_svr", "VAV_L28S1_TSetTooColdRoomCount_svr",
                  "VAV_L17S2_UnderCoolRoomCount_svr", "VAV_L29S1_OverHeatRoomCount_svr", "roof_CTFan2_SPD",
                  "VAV_L28S2_BelowTIntervalRoomCount_svr", "L1S1_FCUS2_DAY.NGT",
                  "VAV_L18S2_BelowTIntervalRoomCount_svr", "VAV_L8S1_TSetTooHotRoomCount_svr", "L30S2_AHUC_OADamperMin",
                  "L13S2_AHU2_returnAirDamper", "VAV_L20S1_UnderCoolRoomCount_svr", "L5S2_AHU2_OADampers",
                  "L30S2_AHUS_OADampers", "VAV_L28S1_AboveTIntervalRoomCount_svr", "L29_Chiller3_LoadkW",
                  "roof_CTFan3_SPD", "L29_PCHWP3_Status", "VAV_L1S1_BelowTIntervalRoomCount_svr",
                  "VAV_L6S2_AboveTIntervalRoomCount_svr", "VAV_L12S1_AboveTIntervalRoomCount_svr",
                  "L11S2_AHU2_returnAirDamper", "L16S1_AHU1A_OADampers", "L1S2_AHU2_chilledWaterValve",
                  "VAV_L29S1_AboveTIntervalRoomCount_svr", "L29_Chiller3_CWLeavingTemp",
                  "VAV_L23S2_AboveTIntervalRoomCount_svr", "L29_Chiller3_System2EvaporatorPressure",
                  "VAV_L3S1_AboveTIntervalRoomCount_svr", "VAV_L7S1_UnderCoolRoomCount_svr",
                  "VAV_L19S2_AboveTIntervalRoomCount_svr", "L9S2_AHU2_returnAirDamper", "L10S1_AHU1_returnAirDamper",
                  "L15S1_AHU1A_returnAirDamper", "VAV_L17S1_BelowTIntervalRoomCount_svr", "L30S2_RAFan4_SADamper",
                  "VAV_L1S2_AboveTIntervalRoomCount_svr", "VAV_L20S2_BelowTIntervalRoomCount_svr",
                  "L29_Chiller3_System2CondenserPressure", "L3S2_AHU2_returnAirDamper", "L30S2_RAFan3_SADamper",
                  "VAV_L13S1_OverHeatRoomCount_svr", "VAV_L4S1_TSetTooHotRoomCount_svr",
                  "VAV_L12S1_TSetTooColdRoomCount_svr", "VAV_L4S2_AboveTIntervalRoomCount_svr",
                  "L30S1_AHUS_OADamperMin", "L30S2_AHUW_OADamperMin", "VAV_L11S2_OverHeatRoomCount_svr",
                  "VAV_L18S2_TSetTooColdRoomCount_svr", "VAV_L4S2_UnderCoolRoomCount_svr",
                  "VAV_L30S1_TSetTooHotRoomCount_svr", "VAV_L18S2_AboveTIntervalRoomCount_svr",
                  "L8S1_AHU1_returnAirDamper", "VAV_L7S2_TSetTooColdRoomCount_svr", "L29_PCHWP2_Status",
                  "VAV_L15S1_BelowTIntervalRoomCount_svr", "L29_Boiler34_ReturnT", "VAV_L19S2_TSetTooColdRoomCount_svr",
                  "L14S1_AHU1_averageTemp", "roof_CTSTG1_SupplyTSP", "L16S1_AHU1B_OADamperMin", "L29_CWP1_Speed",
                  "VAV_L30S2_UnderCoolRoomCount_svr", "L29_SCHWP1_Speed", "VAV_L19S1_OverHeatRoomCount_svr",
                  "VAV_L10S2_BelowTIntervalRoomCount_svr", "L12S2_AHU2_OADampers", "VAV_L5S2_UnderCoolRoomCount_svr",
                  "VAV_L20S1_TSetTooHotRoomCount_svr", "L30S2_AHUS_OADamperMin", "VAV_L14S2_UnderCoolRoomCount_svr",
                  "VAV_L14S2_TSetTooColdRoomCount_svr", "VAV_L12S2_AboveTIntervalRoomCount_svr",
                  "L12S2_AHU2_returnAirDamper", "VAV_L10S1_UnderCoolRoomCount_svr",
                  "L29_Chiller1_System2EvaporatorPressure", "VAV_L11S1_TSetTooColdRoomCount_svr",
                  "VAV_L19S1_AboveTIntervalRoomCount_svr", "VAV_L21S1_UnderCoolRoomCount_svr", "L6S1_AHU1_OADampers",
                  "VAV_L9S2_OverHeatRoomCount_svr", "L5S1_CZ_AVGSP", "L29_Chiller1_LoadkW",
                  "VAV_L7S1_TSetTooHotRoomCount_svr", "L29_CHWP2_Speed", "L15S2_AHU2A_returnAirDamper",
                  "VAV_L17S2_TSetTooHotRoomCount_svr", "VAV_L2S1_BelowTIntervalRoomCount_svr",
                  "VAV_L14S1_TSetTooHotRoomCount_svr", "VAV_L14S2_AboveTIntervalRoomCount_svr",
                  "VAV_L11S2_BelowTIntervalRoomCount_svr", "VAV_L20S2_OverHeatRoomCount_svr",
                  "VAV_L3S2_TSetTooColdRoomCount_svr", "VAV_L16S1_AboveTIntervalRoomCount_svr",
                  "VAV_L16S2_UnderCoolRoomCount_svr", "L29_PCHWP2_Enable", "L29_Chiller2_LoadkW",
                  "L29_Chiller2_System2CondenserPressure", "L6S2_AHU2_returnAirDamper",
                  "VAV_L10S2_OverHeatRoomCount_svr", "L29_CWP3_Enable", "L29_Chiller3_CWLeavingTemp_HL",
                  "L29_PCHWP3_Speed", "roof_CTFan4_OnOff", "VAV_L28S2_TSetTooHotRoomCount_svr",
                  "L16S1_AHU1A_returnAirDamper", "VAV_L28S2_OverHeatRoomCount_svr", "VAV_L14S1_UnderCoolRoomCount_svr",
                  "VAV_L6S2_UnderCoolRoomCount_svr", "L29_CHWP4_Status", "VAV_L16S2_BelowTIntervalRoomCount_svr",
                  "VAV_L10S1_BelowTIntervalRoomCount_svr", "roof_CTFan32_OnOff", "L29_Boiler2_ReturnT",
                  "L5S1_AHU1_returnAirDamper", "VAV_L15S1_AboveTIntervalRoomCount_svr",
                  "VAV_L23S2_BelowTIntervalRoomCount_svr", "L7S2_AHU2_OADampers", "VAV_L20S2_TSetTooHotRoomCount_svr",
                  "VAV_L3S1_UnderCoolRoomCount_svr", "VAV_L14S1_TSetTooColdRoomCount_svr", "L29_CHWP1_Speed",
                  "VAV_L17S2_AboveTIntervalRoomCount_svr", "VAV_L29S2_OverHeatRoomCount_svr",
                  "VAV_L17S1_TSetTooHotRoomCount_svr", "L3S1_AHU1_OADampers", "L29_CHWP3_Status",
                  "VAV_L19S2_TSetTooHotRoomCount_svr", "L1S2_AHU2_hotWaterValve", "VAV_L29S2_TSetTooColdRoomCount_svr",
                  "VAV_L5S1_UnderCoolRoomCount_svr", "L7S1_CZ_AVGSP", "L8S2_AHU2_OADampers", "L29_PCHWP1_Status",
                  "VAV_L18S1_UnderCoolRoomCount_svr", "L30S1_AHUW_OADampers", "L16S2_AHU2A_reliefAirDampersPosition",
                  "L29_CHWP1_Enable", "L29_Chiller1_CWLeavingTemp_HL", "VAV_L21S2_BelowTIntervalRoomCount_svr",
                  "VAV_L1S1_TSetTooHotRoomCount_svr", "VAV_L3S1_TSetTooColdRoomCount_svr", "L30S2_AHUW_returnAirDamper",
                  "L29_HWP4_Enable", "VAV_L16S2_AboveTIntervalRoomCount_svr", "VAV_L12S1_BelowTIntervalRoomCount_svr",
                  "VAV_L30S2_TSetTooHotRoomCount_svr", "roof_CTFan12_CWreturnT", "VAV_L6S2_TSetTooColdRoomCount_svr",
                  "VAV_L20S1_OverHeatRoomCount_svr", "VAV_L29S2_TSetTooHotRoomCount_svr", "L7S1_AHU1_OADampers",
                  "VAV_L12S2_UnderCoolRoomCount_svr", "L30S1_AHUE_returnAirDamper", "VAV_L9S2_UnderCoolRoomCount_svr",
                  "L4S1_AHU1_returnAirDamper", "L5S2_FCUS1_HTGLOOP", "VAV_L13S1_AboveTIntervalRoomCount_svr",
                  "VAV_L28S2_TSetTooColdRoomCount_svr", "VAV_L1S1_UnderCoolRoomCount_svr", "L6S2_AHU2_OADampers",
                  "L1S1_AHU1_OADampers", "VAV_L10S1_TSetTooColdRoomCount_svr", "VAV_L5S2_OverHeatRoomCount_svr",
                  "VAV_L21S2_AboveTIntervalRoomCount_svr", "VAV_L3S2_OverHeatRoomCount_svr", "L9S2_PAC2_DAY.NGT",
                  "VAV_L4S2_OverHeatRoomCount_svr", "VAV_L2S1_AboveTIntervalRoomCount_svr",
                  "VAV_L13S1_TSetTooColdRoomCount_svr", "VAV_L23S1_AboveTIntervalRoomCount_svr", "L29_CWP2_Enable",
                  "VAV_L9S1_AboveTIntervalRoomCount_svr", "L30S1_AHUN_returnAirDamper",
                  "VAV_L9S2_TSetTooColdRoomCount_svr", "roof_CTFan4_Enable", "VAV_L7S2_UnderCoolRoomCount_svr",
                  "L15S2_AHU2B_OADampers", "VAV_L6S1_TSetTooColdRoomCount_svr", "VAV_L18S1_OverHeatRoomCount_svr",
                  "VAV_L16S1_OverHeatRoomCount_svr", "VAV_L9S2_BelowTIntervalRoomCount_svr", "L4S1_AHU1_OADampers",
                  "VAV_L18S1_TSetTooHotRoomCount_svr", "L29_Boiler4_SupplyT", "VAV_L30S1_OverHeatRoomCount_svr",
                  "VAV_L7S2_TSetTooHotRoomCount_svr", "L29_Chiller3_LoadPCT", "VAV_L6S2_OverHeatRoomCount_svr",
                  "VAV_L30S1_AboveTIntervalRoomCount_svr", "L5S1_AHU1_OADampers", "L29_SCHWP1_ReturnTemp",
                  "VAV_L5S1_OverHeatRoomCount_svr", "VAV_L13S1_TSetTooHotRoomCount_svr", "L29_CHWP3_Speed",
                  "L30S1_AHUW_OADamperMin", "L8S2_AHU2_returnAirDamper", "VAV_L14S2_BelowTIntervalRoomCount_svr",
                  "VAV_L7S1_BelowTIntervalRoomCount_svr", "VAV_L19S1_TSetTooHotRoomCount_svr", "L10S2_AHU2_OADampers",
                  "VAV_L21S1_AboveTIntervalRoomCount_svr", "L9S2_CZ_AVGTemp", "VAV_L29S1_UnderCoolRoomCount_svr",
                  "VAV_L12S2_TSetTooColdRoomCount_svr", "VAV_L29S2_AboveTIntervalRoomCount_svr",
                  "VAV_L20S1_BelowTIntervalRoomCount_svr", "VAV_L6S1_OverHeatRoomCount_svr",
                  "L29_Chiller2_CHWsupplyTemp_LWT_HL", "VAV_L14S2_OverHeatRoomCount_svr",
                  "VAV_L20S2_UnderCoolRoomCount_svr", "L3S1_AHU1_returnAirDamper", "L29_Chiller2_Status",
                  "VAV_L16S2_TSetTooColdRoomCount_svr", "VAV_L12S1_UnderCoolRoomCount_svr", "roof_CTFan2_Enable",
                  "L16S1_AHU1A_reliefAirDampersPosition", "VAV_L21S1_BelowTIntervalRoomCount_svr",
                  "VAV_L15S1_TSetTooColdRoomCount_svr", "L6S2_FCUS1_HTGLOOP", "L30S2_AHUN_returnAirTemp",
                  "VAV_L1S2_TSetTooColdRoomCount_svr", "L14S1_AHU1_returnAirDamper",
                  "VAV_L4S1_AboveTIntervalRoomCount_svr", "VAV_L23S1_OverHeatRoomCount_svr", "L1S2_AHU2_OADampers",
                  "VAV_L4S1_OverHeatRoomCount_svr", "VAV_L11S1_BelowTIntervalRoomCount_svr",
                  "VAV_L4S2_BelowTIntervalRoomCount_svr", "L29_Boiler1_ReturnT",
                  "VAV_L28S1_BelowTIntervalRoomCount_svr", "roof_CTFan31_OnOff", "VAV_L1S2_UnderCoolRoomCount_svr",
                  "VAV_L9S1_TSetTooColdRoomCount_svr", "VAV_L18S2_UnderCoolRoomCount_svr",
                  "VAV_L14S1_AboveTIntervalRoomCount_svr", "VAV_L7S2_AboveTIntervalRoomCount_svr",
                  "VAV_L10S2_UnderCoolRoomCount_svr", "VAV_L2S2_UnderCoolRoomCount_svr", "L8S2_FCUS1_HTGLOOP",
                  "L29_CWP1_Enable", "VAV_L28S1_TSetTooHotRoomCount_svr", "L7S2_FCUS1_HTGLOOP",
                  "VAV_L9S1_TSetTooHotRoomCount_svr", "VAV_L1S2_BelowTIntervalRoomCount_svr",
                  "VAV_L18S1_TSetTooColdRoomCount_svr", "VAV_L19S2_BelowTIntervalRoomCount_svr",
                  "L12S1_AHU1_returnAirDamper", "VAV_L9S1_BelowTIntervalRoomCount_svr",
                  "VAV_L17S1_UnderCoolRoomCount_svr", "L9S1_AHU1_returnAirDamper", "L1S1_AHU1_hotWaterValve",
                  "L30S2_AHUN_OADamperMin", "VAV_L14S1_OverHeatRoomCount_svr", "L30S1_AHUN_OADampers",
                  "L30S2_AHUW_OADampers", "VAV_L23S2_TSetTooHotRoomCount_svr", "L16S1_AHU1B_returnAirDamper",
                  "VAV_L11S1_UnderCoolRoomCount_svr", "L29_Boiler3_Enable", "L29_PCHWP1_Speed",
                  "VAV_L8S1_AboveTIntervalRoomCount_svr", "L15S1_AHU1B_returnAirDamper", "L15S2_AHU2B_returnAirDamper",
                  "VAV_L15S2_BelowTIntervalRoomCount_svr", "VAV_L30S2_BelowTIntervalRoomCount_svr",
                  "VAV_L2S1_TSetTooColdRoomCount_svr", "L29_CHWP3_Enable", "roof_CTFan1_Enable",
                  "VAV_L23S1_BelowTIntervalRoomCount_svr", "VAV_L11S2_AboveTIntervalRoomCount_svr",
                  "VAV_L2S2_TSetTooHotRoomCount_svr", "VAV_L19S1_BelowTIntervalRoomCount_svr",
                  "VAV_L1S2_OverHeatRoomCount_svr", "L30S1_AHUC_returnAirTemp", "VAV_L6S2_TSetTooHotRoomCount_svr",
                  "L30S1_AHUS_OADampers", "VAV_L28S2_AboveTIntervalRoomCount_svr", "VAV_L8S1_OverHeatRoomCount_svr",
                  "VAV_L12S1_TSetTooHotRoomCount_svr", "VAV_L5S1_TSetTooColdRoomCount_svr",
                  "L29_Chiller1_CWLeavingTemp", "VAV_L2S2_TSetTooColdRoomCount_svr", "L30S2_AHUC_returnAirDamper",
                  "L5S2_AHU2_returnAirDamper", "L30S2_AHUS_returnAirDamper", "L7S1_AHU1_returnAirDamper",
                  "L16S1_AHU1B_OADampers", "roof_CTFan3132_CWsupplyT", "L29_Chiller1_Enable", "L29_Boiler3_SupplyT",
                  "VAV_L6S1_BelowTIntervalRoomCount_svr", "VAV_L10S2_TSetTooHotRoomCount_svr", "L16S2_AHU2A_OADampers",
                  "L11S2_AHU2_OADampers", "roof_CTFan34_CWsupplyT", "roof_CTFan2_OnOff", "L1S2_AHU2_returnAirDamper",
                  "L4S2_AHU2_returnAirDamper", "roof_CTFan32_SPD", "L30S2_AHUC_returnAirTemp", "roof_CTFan3_Enable",
                  "VAV_L11S1_TSetTooHotRoomCount_svr", "L7S2_AHU2_returnAirDamper", "VAV_L21S1_TSetTooHotRoomCount_svr",
                  "L29_CHWP2_SupplyTemp", "VAV_L1S1_AboveTIntervalRoomCount_svr", "L30S1_AHUC_returnAirDamper",
                  "VAV_L17S1_AboveTIntervalRoomCount_svr", "VAV_L18S2_TSetTooHotRoomCount_svr", "roof_CTSTG2_SupplyTSP",
                  "VAV_L9S2_TSetTooHotRoomCount_svr", "VAV_L23S1_TSetTooHotRoomCount_svr", "L29_CHWP1_Status",
                  "VAV_L15S2_TSetTooColdRoomCount_svr", "VAV_L21S2_TSetTooColdRoomCount_svr",
                  "VAV_L2S2_AboveTIntervalRoomCount_svr", "L29_Chiller2_CWLeavingTemp", "L30S1_RAFan41_SADamper",
                  "L29_CHWP2_Enable", "VAV_L8S1_BelowTIntervalRoomCount_svr", "VAV_L10S1_TSetTooHotRoomCount_svr",
                  "L9S2_FCUN2_DAY.NGT", "VAV_L23S2_UnderCoolRoomCount_svr", "L29_Boiler1_SupplyT",
                  "VAV_L28S1_UnderCoolRoomCount_svr", "VAV_L17S1_TSetTooColdRoomCount_svr",
                  "VAV_L28S1_OverHeatRoomCount_svr", "L29_Chiller2_LoadPCT", "VAV_L13S2_BelowTIntervalRoomCount_svr",
                  "VAV_L5S2_TSetTooColdRoomCount_svr", "L30S1_AHUS_returnAirTemp", "L29_Boiler2_Enable",
                  "VAV_L15S2_AboveTIntervalRoomCount_svr", "VAV_L12S2_OverHeatRoomCount_svr",
                  "VAV_L3S1_TSetTooHotRoomCount_svr", "L29_PCHWP1_Enable", "L29_Chiller2_System2EvaporatorPressure",
                  "VAV_L6S1_UnderCoolRoomCount_svr", "VAV_L12S2_TSetTooHotRoomCount_svr",
                  "L30S2_AHUC_returnAirHumidity", "VAV_L1S2_TSetTooHotRoomCount_svr",
                  "VAV_L8S2_AboveTIntervalRoomCount_svr", "L29_Boiler4_Enable", "L15S1_AHU1A_OADampers",
                  "VAV_L18S1_AboveTIntervalRoomCount_svr", "VAV_L6S1_TSetTooHotRoomCount_svr",
                  "VAV_L7S1_OverHeatRoomCount_svr", "L29_Chiller3_Status", "L29_Chiller1_System1CondenserPressure",
                  "L30S1_AHUN_OADamperMin", "VAV_L4S1_UnderCoolRoomCount_svr", "VAV_L9S1_OverHeatRoomCount_svr",
                  "roof_CTFan31_Enable", "VAV_L21S2_UnderCoolRoomCount_svr", "VAV_L14S1_BelowTIntervalRoomCount_svr",
                  "VAV_L15S2_OverHeatRoomCount_svr", "VAV_L16S1_BelowTIntervalRoomCount_svr",
                  "VAV_L7S1_AboveTIntervalRoomCount_svr", "VAV_L29S1_BelowTIntervalRoomCount_svr",
                  "VAV_L3S1_OverHeatRoomCount_svr", "VAV_L8S2_TSetTooColdRoomCount_svr",
                  "VAV_L8S2_BelowTIntervalRoomCount_svr", "L1S2_PAC4_DAY.NGT", "VAV_L16S1_TSetTooHotRoomCount_svr",
                  "VAV_L13S2_TSetTooColdRoomCount_svr", "VAV_L3S2_UnderCoolRoomCount_svr",
                  "L29_Chiller3_CHWsupplyTemp_LWT_HL", "VAV_L4S2_TSetTooColdRoomCount_svr", "L12S1_AHU1_averageTemp",
                  "VAV_L17S2_TSetTooColdRoomCount_svr", "roof_CTFan4_SPD", "L29_Chiller3_Enable",
                  "VAV_L19S2_OverHeatRoomCount_svr", "L30S2_AHUC_economyMode", "L30S1_AHUC_returnAirHumidity",
                  "VAV_L3S1_BelowTIntervalRoomCount_svr", "L3S2_FCUS1_HTGLOOP", "L1S2_AHU2_outsideAirHumidity",
                  "roof_CTFan1_SPD", "VAV_L13S2_UnderCoolRoomCount_svr", "VAV_L30S1_BelowTIntervalRoomCount_svr",
                  "roof_CTFan1_OnOff", "L30S1_AHUW_returnAirDamper", "VAV_L16S1_UnderCoolRoomCount_svr",
                  "L29_PCHWP2_Speed", "VAV_L5S2_TSetTooHotRoomCount_svr", "VAV_L17S2_BelowTIntervalRoomCount_svr",
                  "L30S1_AHUE_OADampers", "L30S1_AHUC_economyMode", "VAV_L20S2_AboveTIntervalRoomCount_svr",
                  "L29_CHWHeaderTempSupply", "L29_CWP2_Speed", "VAV_L23S2_TSetTooColdRoomCount_svr",
                  "L6S1_AHU1_returnAirDamper", "VAV_L9S2_AboveTIntervalRoomCount_svr", "L9S2_AHU2_OADampers",
                  "VAV_L12S2_BelowTIntervalRoomCount_svr", "VAV_L8S2_UnderCoolRoomCount_svr",
                  "VAV_L20S2_TSetTooColdRoomCount_svr", "VAV_L10S1_OverHeatRoomCount_svr",
                  "VAV_L7S1_TSetTooColdRoomCount_svr", "VAV_L2S1_TSetTooHotRoomCount_svr", "L1S1_AHU1_returnAirDamper",
                  "L29_Chiller1_LoadPCT", "L13S1_AHU1_returnAirDamper", "L29_Chiller2_Enable",
                  "L30S1_RAFan42_SADamper"]}, "error": 0}),
    (293, 'operationModel',
     {"value": {"flag2": [], "flag0": ["L29_HWP1_Enable", "L29_HWP2_Enable", "L29_HWP3_Enable", "L29_HWP4_Enable"]},
      "error": 0}),
    (293, 'Accum_ChGroup_GroupEnergy', {
        "value": {"flag2": ["Accum_Ch002_ChEnergy", "Accum_Ch001_ChEnergy", "Accum_Ch003_ChEnergy"],
                  "flag0": ["L29_Chiller3_LoadkW", "L29_Chiller2_LoadkW", "L29_Chiller1_LoadkW"]}, "error": 0}),
    (293, 'Accum_ChGroup_GroupEnergy,operationModel', {
        "value": {"flag2": ["Accum_Ch002_ChEnergy", "Accum_Ch001_ChEnergy", "Accum_Ch003_ChEnergy"],
                  "flag0": ["L29_Chiller2_LoadkW", "L29_HWP1_Enable", "L29_HWP3_Enable", "L29_HWP2_Enable",
                            "L29_HWP4_Enable", "L29_Chiller3_LoadkW", "L29_Chiller1_LoadkW"]}, "error": 0}),
    (293, 'DiagStaticsWork', {"value": {"flag2": [], "flag0": []}, "error": 0}),
    (293, 'operationModel1,Accum_ChGroup_GroupEnergy', {
        "value": {"flag2": ["Accum_Ch002_ChEnergy", "Accum_Ch001_ChEnergy", "Accum_Ch003_ChEnergy"],
                  "flag0": ["L29_Chiller3_LoadkW", "L29_Chiller2_LoadkW", "L29_Chiller1_LoadkW"]}, "error": 0}),
    ('', 'operationModel', 1)
])
def test_correct(projId, pointname, expected):
    rt = json.loads(do_get_depend(projId, pointname))
    if expected == 1:
        assert rt.get(
            'error') == expected, 'actual is not equeal to expected,actual error is {0},expected is {1}'.format(
            rt.get('error'), expected)
    else:
        assert rt, 'actual is null'
        assert not rt.get('error'), 'acutal error is True,acutal is {0}'.format(rt)
        expected_value_flag0 = expected.get('value').get('flag0')
        acutal_value_flag0 = rt.get('value').get('flag0')
        expected_value_flag2 = expected.get('value').get('flag2')
        acutal_value_flag2 = rt.get('value').get('flag2')
        assert len(acutal_value_flag0) == len(
            expected_value_flag0), 'flag0 length is not equal expected,actual is {0},expected is {1}'.format(
            len(acutal_value_flag0), len(expected_value_flag0))
        assert len(expected_value_flag2) == len(
            acutal_value_flag2), 'flag2 length is not equal expected,actual is {0},expected is {1}'.format(
            len(expected_value_flag2), len(acutal_value_flag2))
        for value in acutal_value_flag0:
            assert value in expected_value_flag0, 'actual flag0 value is not in expected value ,actual value is {0}'.format(
                value)
        for value in acutal_value_flag2:
            assert value in expected_value_flag2, 'actual flag2 value is not in expected value ,actual value is {0}'.format(
                value)