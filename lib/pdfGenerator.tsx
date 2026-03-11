import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Font,
  StyleSheet,
  renderToBuffer,
  Svg,
  Path as SvgPath,
} from "@react-pdf/renderer";
import nodePath from "path";
import { SALON_CONFIG } from "@/app/config/salon";
import {
  type ContraindicationWithFollowUp,
  rodoInfo,
  contraindicationsByFormType,
  modelowanieUstNaturalReactions,
  modelowanieUstComplications,
  modelowanieUstPostCare,
  wolumetriaTwarzyNaturalReactions,
  wolumetriaTwarzyComplications,
  wolumetriaTwarzyPostCare,
  hyaluronicNaturalReactions,
  hyaluronicComplications,
  hyaluronicPostCare,
  mezoterapiaIglowaNaturalReactions,
  mezoterapiaIglowaComplications,
  mezoterapiaIglowaComplicationsVeryRare,
  mezoterapiaIglowaPostCare,
  lipolizaIniekcyjnaNaturalReactions,
  lipolizaIniekcyjnaComplications,
  lipolizaIniekcyjnaPostCare,
  makijazPermanentnyNaturalReactions,
  makijazPermanentnyComplications,
  makijazPermanentnyPostCare,
  laseroweUsuwanieNaturalReactions,
  laseroweUsuwanieComplications,
  laseroweUsuwaniePostCare,
  depilacjaLaserowaNaturalReactions,
  depilacjaLaserowaComplications,
  depilacjaLaserowaPostCare,
  biostymulatorySideEffects,
  biostymulatoryComplications,
  biostymulatoryPostTreatment,
} from "@/types/booking";
import { ZONES as FACE_ZONES } from "@/types/face-zones";
import { ZONES as TISSUE_ZONES } from "@/types/face-zones-tissue";
import { ZONES as PMU_ZONES } from "@/types/face-zone-pernament";
import { BODY_ZONES } from "@/types/body-zones";

// Register Roboto font for Polish character support
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontStyle: "italic",
    },
  ],
});

// Brand colors — white background for clean printing
const BROWN = "#8b7355"; // Main accent (borders, titles, bullets)
const DARK_BROWN = "#4a4540"; // Dark text, headers
const BEIGE = "#FFFFFF"; // Page background (white for clean print)
const BEIGE_LIGHT = "#f5f5f5"; // Alternating rows
const BORDER_BEIGE = "#e0e0e0"; // Subtle borders
const DARK = "#3a3632"; // Main text
const GRAY = "#6b635a"; // Secondary text
const WHITE = "#FFFFFF";
const RED = "#c0392b"; // TAK answers, UWAGA
const GREEN_DARK = "#1a5c2a"; // NIE answers, verified status

// Form type titles
const FORM_TYPE_TITLES: Record<string, string> = {
  LIP_AUGMENTATION: "KARTA ZGODY NA ZABIEG MODELOWANIA UST",
  FACIAL_VOLUMETRY: "KARTA ZGODY NA ZABIEG WOLUMETRII TWARZY",
  NEEDLE_MESOTHERAPY: "KARTA ZGODY NA ZABIEG MEZOTERAPII IGŁOWEJ",
  INJECTION_LIPOLYSIS: "KARTA ZGODY NA ZABIEG LIPOLIZY INIEKCYJNEJ",
  PERMANENT_MAKEUP: "KARTA ZGODY NA ZABIEG MAKIJAŻU PERMANENTNEGO",
  LASER_HAIR_REMOVAL: "KARTA ZGODY NA ZABIEG DEPILACJI LASEROWEJ",
  LASER_TATTOO_REMOVAL: "KARTA ZGODY NA ZABIEG LASEROWEGO USUWANIA TATUAŻU",
  WRINKLE_REDUCTION: "KARTA ZGODY NA ZABIEG REDUKCJI ZMARSZCZEK",
  EYELID_LIFT: "KARTA ZGODY NA ZABIEG LIFTINGU POWIEK",
  TISSUE_STIMULATION: "KARTA ZGODY NA ZABIEG STYMULACJI TKANKOWEJ",
  EYEBROW_TINTING: "KARTA ZGODY NA ZABIEG HENNY BRWI",
  EYELASH_EXTENSION: "KARTA ZGODY NA ZABIEG PRZEDŁUŻANIA RZĘS",
  EYEBROW_LAMINATION: "KARTA ZGODY NA ZABIEG LAMINACJI BRWI",
};

const FORM_TYPE_LABELS: Record<string, string> = {
  HYALURONIC: "Kwas hialuronowy",
  LIP_AUGMENTATION: "Modelowanie ust",
  FACIAL_VOLUMETRY: "Wolumetria twarzy",
  NEEDLE_MESOTHERAPY: "Mezoterapia igłowa",
  INJECTION_LIPOLYSIS: "Lipoliza iniekcyjna",
  PERMANENT_MAKEUP: "Makijaż permanentny",
  LASER_HAIR_REMOVAL: "Depilacja laserowa",
  LASER_TATTOO_REMOVAL: "Laserowe usuwanie tatuażu",
  WRINKLE_REDUCTION: "Redukcja zmarszczek",
  EYELID_LIFT: "Lifting powiek",
  TISSUE_STIMULATION: "Stymulacja tkankowa",
  EYEBROW_TINTING: "Henna brwi",
  EYELASH_EXTENSION: "Przedłużanie rzęs",
  EYEBROW_LAMINATION: "Laminacja brwi",
};

const DEFAULT_CEL_EFEKTU: Record<string, string> = {
  // Only for forms that do NOT have an interactive cel/efekt field:
  LASER_HAIR_REMOVAL: "Usunięcie włosów z ciała",
  LASER_TATTOO_REMOVAL: "Usunięcie tatuażu / makijażu permanentnego",
  NEEDLE_MESOTHERAPY: "Nawilżenie, odżywienie i rewitalizacja skóry",
  TISSUE_STIMULATION: "Stymulacja tkankowa i modelowanie twarzy",
  EYELID_LIFT: "Lifting i odmłodzenie okolicy powiek",
  EYEBROW_TINTING: "Podkreślenie i definiowanie kształtu brwi",
  EYELASH_EXTENSION: "Przedłużenie i zagęszczenie rzęs",
  EYEBROW_LAMINATION: "Laminacja i stylizacja brwi",
};

interface FormContent {
  title: string;
  naturalReactions: string[];
  complications: {
    czeste?: string[];
    rzadkie?: string[];
    bardzoRzadkie?: string[];
  };
  postCare: string[];
  contraindications: Record<string, string | ContraindicationWithFollowUp>;
}

function getFormContent(type: string): FormContent {
  const title = FORM_TYPE_TITLES[type] || "KARTA ZGODY NA ZABIEG";
  const contraindications =
    contraindicationsByFormType[
      type as keyof typeof contraindicationsByFormType
    ] || {};

  switch (type) {
    case "LIP_AUGMENTATION":
      return {
        title,
        naturalReactions: modelowanieUstNaturalReactions,
        complications: modelowanieUstComplications,
        postCare: modelowanieUstPostCare,
        contraindications,
      };
    case "FACIAL_VOLUMETRY":
      return {
        title,
        naturalReactions: wolumetriaTwarzyNaturalReactions,
        complications: wolumetriaTwarzyComplications,
        postCare: wolumetriaTwarzyPostCare,
        contraindications,
      };
    case "NEEDLE_MESOTHERAPY":
      return {
        title,
        naturalReactions: mezoterapiaIglowaNaturalReactions,
        complications: {
          czeste: mezoterapiaIglowaComplications as unknown as string[],
          bardzoRzadkie: mezoterapiaIglowaComplicationsVeryRare,
        },
        postCare: mezoterapiaIglowaPostCare,
        contraindications,
      };
    case "INJECTION_LIPOLYSIS":
      return {
        title,
        naturalReactions: lipolizaIniekcyjnaNaturalReactions,
        complications: lipolizaIniekcyjnaComplications,
        postCare: lipolizaIniekcyjnaPostCare,
        contraindications,
      };
    case "PERMANENT_MAKEUP":
      return {
        title,
        naturalReactions: makijazPermanentnyNaturalReactions,
        complications: makijazPermanentnyComplications,
        postCare: makijazPermanentnyPostCare,
        contraindications,
      };
    case "LASER_HAIR_REMOVAL":
      return {
        title,
        naturalReactions: depilacjaLaserowaNaturalReactions,
        complications: depilacjaLaserowaComplications,
        postCare: depilacjaLaserowaPostCare,
        contraindications,
      };
    case "LASER_TATTOO_REMOVAL":
      return {
        title,
        naturalReactions: laseroweUsuwanieNaturalReactions,
        complications: laseroweUsuwanieComplications,
        postCare: laseroweUsuwaniePostCare,
        contraindications,
      };
    case "TISSUE_STIMULATION":
      return {
        title,
        naturalReactions: biostymulatorySideEffects,
        complications: biostymulatoryComplications,
        postCare: biostymulatoryPostTreatment,
        contraindications,
      };
    case "WRINKLE_REDUCTION":
      return {
        title,
        naturalReactions: wolumetriaTwarzyNaturalReactions,
        complications: wolumetriaTwarzyComplications,
        postCare: wolumetriaTwarzyPostCare,
        contraindications,
      };
    default:
      return {
        title,
        naturalReactions: hyaluronicNaturalReactions,
        complications: hyaluronicComplications,
        postCare: hyaluronicPostCare,
        contraindications,
      };
  }
}

// Zone name lookup maps
const faceZoneMap = new Map(FACE_ZONES.map((z) => [z.id, z.name]));
const bodyZoneMap = new Map(BODY_ZONES.map((z) => [z.id, z.name]));

function getZoneNames(obszarZabiegu: string | null | undefined): string[] {
  if (!obszarZabiegu) return [];
  return obszarZabiegu
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => faceZoneMap.get(id) || bodyZoneMap.get(id) || id)
    .filter(Boolean);
}

// Face diagram - form types that use it
const FACE_DIAGRAM_TYPES = new Set([
  "LIP_AUGMENTATION",
  "FACIAL_VOLUMETRY",
  "WRINKLE_REDUCTION",
  "TISSUE_STIMULATION",
  "PERMANENT_MAKEUP",
  "HYALURONIC",
]);

function getZonesForType(type: string) {
  switch (type) {
    case "TISSUE_STIMULATION":
      return TISSUE_ZONES;
    case "PERMANENT_MAKEUP":
      return PMU_ZONES;
    default:
      return FACE_ZONES;
  }
}

const FACE_CHART_IMAGE = nodePath.join(
  process.cwd(),
  "public",
  "women-face-chart.jpg",
);

function FaceZoneDiagram({
  zones,
  selectedIds,
}: {
  zones: { id: string; name: string; d: string }[];
  selectedIds: string[];
}) {
  return (
    <View
      style={{
        position: "relative",
        width: 320,
        height: 320,
        alignSelf: "center",
        marginTop: 16,
        marginBottom: 12,
      }}
    >
      <Image
        src={FACE_CHART_IMAGE}
        style={{ width: 320, height: 320, borderRadius: 4 }}
      />
      <Svg
        viewBox="0 0 980 980"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 320,
          height: 320,
        }}
      >
        {zones.map((zone) => {
          const isSelected = selectedIds.includes(zone.id);
          return (
            <SvgPath
              key={zone.id}
              d={zone.d}
              fill="#8b7355"
              fillOpacity={isSelected ? 0.5 : 0.15}
              stroke="#8b7355"
              strokeOpacity={isSelected ? 1 : 0.3}
              strokeWidth={isSelected ? 3 : 1}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const BODY_CHART_IMAGE = nodePath.join(
  process.cwd(),
  "public",
  "women-body-chart.JPG",
);

const BODY_DIAGRAM_TYPES = new Set(["LASER_HAIR_REMOVAL"]);

function BodyZoneDiagram({
  zones,
  selectedIds,
}: {
  zones: { id: string; name: string; d: string }[];
  selectedIds: string[];
}) {
  return (
    <View
      style={{
        position: "relative",
        width: 240,
        height: 340,
        alignSelf: "center",
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <Image
        src={BODY_CHART_IMAGE}
        style={{ width: 240, height: 340, borderRadius: 4 }}
      />
      <Svg
        viewBox="0 0 724 1024"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 240,
          height: 340,
        }}
      >
        {zones.map((zone) => {
          const isSelected = selectedIds.includes(zone.id);
          return (
            <SvgPath
              key={zone.id}
              d={zone.d}
              fill="#8b7355"
              fillOpacity={isSelected ? 0.5 : 0.05}
              stroke="#8b7355"
              strokeOpacity={isSelected ? 1 : 0.15}
              strokeWidth={isSelected ? 2 : 0.5}
            />
          );
        })}
      </Svg>
    </View>
  );
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 8,
    color: DARK,
    backgroundColor: BEIGE,
    paddingTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: BROWN,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: DARK_BROWN,
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 7,
    color: BROWN,
    letterSpacing: 1,
    marginTop: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 8,
    color: BROWN,
    fontWeight: "bold",
  },
  headerDate: {
    fontSize: 7,
    color: GRAY,
    marginTop: 2,
  },
  documentTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: DARK_BROWN,
    textAlign: "center",
    marginVertical: 8,
    textTransform: "uppercase",
  },
  signatureBadge: {
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  signatureBadgeText: {
    fontSize: 7,
    fontWeight: "bold",
    color: WHITE,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: BROWN,
    marginTop: 10,
    marginBottom: 4,
    textTransform: "uppercase",
    borderBottomWidth: 0.5,
    borderBottomColor: BROWN,
    paddingBottom: 2,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingVertical: 2,
  },
  fieldLabel: {
    fontSize: 7,
    color: GRAY,
    width: "40%",
  },
  fieldValue: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: DARK,
    width: "60%",
  },
  zoneChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  zoneChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: BROWN,
    borderRadius: 3,
    backgroundColor: WHITE,
  },
  zoneChipText: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: BROWN,
    textTransform: "uppercase",
  },
  // Contraindications table
  contrTable: {
    marginTop: 4,
  },
  contrRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
    minHeight: 14,
  },
  contrRowAlt: {
    backgroundColor: BEIGE_LIGHT,
  },
  contrQuestion: {
    flex: 1,
    fontSize: 7,
    color: DARK,
  },
  contrAnswer: {
    width: 35,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  contrFollowUp: {
    fontSize: 6.5,
    fontStyle: "italic",
    color: BROWN,
    marginLeft: 10,
    marginBottom: 2,
  },
  // Bullet list
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
    paddingRight: 10,
  },
  bulletDot: {
    width: 8,
    fontSize: 7,
    color: BROWN,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 7,
    color: DARK,
  },
  bulletTextRed: {
    flex: 1,
    fontSize: 7,
    color: RED,
    fontWeight: "bold",
  },
  // Complications two columns
  complicationsRow: {
    flexDirection: "row",
    gap: 8,
  },
  complicationColumn: {
    flex: 1,
  },
  complicationTitle: {
    fontSize: 7,
    fontWeight: "bold",
    color: GRAY,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  // RODO box
  rodoBox: {
    borderWidth: 0.5,
    borderColor: BORDER_BEIGE,
    backgroundColor: WHITE,
    padding: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  rodoText: {
    fontSize: 6.5,
    color: DARK,
    lineHeight: 1.4,
  },
  // Signatures
  signatureBlock: {
    marginTop: 6,
    marginBottom: 4,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 120,
    height: 40,
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 0.5,
    borderTopColor: GRAY,
    marginTop: 2,
    paddingTop: 2,
  },
  signatureLabel: {
    fontSize: 6,
    color: GRAY,
    textAlign: "center",
  },
  // Checkboxes
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: GREEN_DARK,
    backgroundColor: "#e8f5e9",
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxUnchecked: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: BORDER_BEIGE,
    backgroundColor: WHITE,
    marginRight: 6,
  },
  checkboxX: {
    fontSize: 7,
    fontWeight: "bold",
    color: GREEN_DARK,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 7,
    color: DARK,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: BORDER_BEIGE,
    paddingTop: 4,
  },
  footerText: {
    fontSize: 6,
    color: GRAY,
  },
  // Mini header for page 2/3
  miniHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: BROWN,
  },
  miniLogoText: {
    fontSize: 11,
    fontWeight: "bold",
    color: DARK_BROWN,
    letterSpacing: 1,
  },
  miniTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: BROWN,
  },
  // Consent statement box
  consentBox: {
    borderWidth: 0.5,
    borderColor: BORDER_BEIGE,
    backgroundColor: WHITE,
    padding: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  consentTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: BROWN,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  consentText: {
    fontSize: 7,
    color: DARK,
    lineHeight: 1.4,
  },
  legalNote: {
    fontSize: 5.5,
    color: GRAY,
    lineHeight: 1.3,
    marginTop: 8,
    textAlign: "center",
  },
  additionalInfo: {
    padding: 6,
    borderWidth: 0.5,
    borderColor: BORDER_BEIGE,
    backgroundColor: WHITE,
    marginTop: 4,
  },
  additionalInfoText: {
    fontSize: 7,
    color: DARK,
    fontStyle: "italic",
  },
});

// Helper components
function PageFooter({ salonName }: { salonName: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{salonName}</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          `Strona ${pageNumber} z ${totalPages}`
        }
      />
    </View>
  );
}

function SalonLogo() {
  return (
    <View>
      <Text style={styles.logoText}>Royal Lips</Text>
      <Text style={styles.logoSubtext}>{SALON_CONFIG.owner}</Text>
    </View>
  );
}

function MiniSalonLogo() {
  return <Text style={styles.miniLogoText}>Royal Lips</Text>;
}

function SignatureBlock({
  signature,
  label,
}: {
  signature: string | null | undefined;
  label: string;
}) {
  return (
    <View style={styles.signatureBlock}>
      {signature ? (
        <View
          style={{
            backgroundColor: WHITE,
            padding: 4,
            borderRadius: 8,
            marginBottom: 4,
            width: 130,
            alignItems: "center",
          }}
        >
          <Image style={styles.signatureImage} src={signature} />
        </View>
      ) : null}
      <View style={styles.signatureLine}>
        <Text style={styles.signatureLabel}>{label}</Text>
      </View>
    </View>
  );
}

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <View style={styles.checkboxRow}>
      {checked ? (
        <View style={styles.checkboxChecked}>
          <Text style={styles.checkboxX}>X</Text>
        </View>
      ) : (
        <View style={styles.checkboxUnchecked} />
      )}
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text
            style={
              item.startsWith("UWAGA")
                ? styles.bulletTextRed
                : styles.bulletText
            }
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

// Main PDF Document component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ConsentFormPdf({ form }: { form: any }) {
  const content = getFormContent(form.type);
  const przeciwwskazania = form.przeciwwskazania || {};
  const zoneNames = getZoneNames(form.obszarZabiegu);
  const createdDate = form.createdAt
    ? new Date(form.createdAt).toLocaleDateString("pl-PL")
    : new Date().toLocaleDateString("pl-PL");
  const docNumber = form.id ? form.id.slice(0, 8).toUpperCase() : "---";

  const isVerified = form.signatureStatus === "VERIFIED";

  return (
    <Document>
      {/* STRONA 1: Dane + Wywiad Medyczny */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <SalonLogo />
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>{SALON_CONFIG.fullName}</Text>
            <Text style={styles.headerDate}>
              {SALON_CONFIG.address}, {SALON_CONFIG.zipCode} {SALON_CONFIG.city}
            </Text>
            <Text style={styles.headerDate}>Data: {createdDate}</Text>
            <Text style={styles.headerDate}>Nr: {docNumber}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.documentTitle}>{content.title}</Text>

        {/* Signature verification badge */}
        {isVerified && (
          <View
            style={[styles.signatureBadge, { backgroundColor: GREEN_DARK }]}
          >
            <Text style={styles.signatureBadgeText}>
              PODPIS ELEKTRONICZNY ZWERYFIKOWANY
            </Text>
          </View>
        )}

        {/* Client data - 2 columns */}
        <Text style={styles.sectionTitle}>Dane Klienta</Text>
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Imię i Nazwisko:</Text>
              <Text style={styles.fieldValue}>{form.imieNazwisko}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Data urodzenia:</Text>
              <Text style={styles.fieldValue}>
                {form.dataUrodzenia || "---"}
              </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Telefon:</Text>
              <Text style={styles.fieldValue}>{form.telefon}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Email:</Text>
              <Text style={styles.fieldValue}>{form.email || "---"}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Adres:</Text>
              <Text style={styles.fieldValue}>
                {[form.ulica, form.kodPocztowy, form.miasto]
                  .filter(Boolean)
                  .join(", ") || "---"}
              </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Data zabiegu:</Text>
              <Text style={styles.fieldValue}>
                {form.miejscowoscData || "---"}
              </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Specjalista:</Text>
              <Text style={styles.fieldValue}>
                {form.osobaPrzeprowadzajacaZabieg || SALON_CONFIG.owner}
              </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Typ zabiegu:</Text>
              <Text style={styles.fieldValue}>
                {FORM_TYPE_LABELS[form.type] || form.type || "---"}
              </Text>
            </View>
            {form.numerZabiegu && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Numer zabiegu:</Text>
                <Text style={styles.fieldValue}>{form.numerZabiegu}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Treatment details */}
        <Text style={styles.sectionTitle}>Szczegóły Zabiegu</Text>
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Preparat:</Text>
              <Text style={styles.fieldValue}>
                {form.nazwaProduktu || "---"}
              </Text>
            </View>
            {form.iloscProduktu && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Ilość:</Text>
                <Text style={styles.fieldValue}>{form.iloscProduktu}</Text>
              </View>
            )}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Znieczulenie:</Text>
              <Text style={styles.fieldValue}>
                {form.znieczulenie || "---"}
              </Text>
            </View>
            {form.metodaZabiegu && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Metoda zabiegu:</Text>
                <Text style={styles.fieldValue}>{form.metodaZabiegu}</Text>
              </View>
            )}
          </View>
          <View style={styles.column}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Cel / Efekt:</Text>
              <Text style={styles.fieldValue}>
                {form.celEfektu || DEFAULT_CEL_EFEKTU[form.type] || "---"}
              </Text>
            </View>
          </View>
        </View>

        {/* Series info */}
        {(form.planowanaIloscZabiegow || form.odstepMiedzyZabiegami) && (
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              {form.planowanaIloscZabiegow && (
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>
                    Planowana ilość zabiegów:
                  </Text>
                  <Text style={styles.fieldValue}>
                    {form.planowanaIloscZabiegow}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.column}>
              {form.odstepMiedzyZabiegami && (
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>
                    Odstęp między zabiegami:
                  </Text>
                  <Text style={styles.fieldValue}>
                    {form.odstepMiedzyZabiegami}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Treatment zones */}
        {zoneNames.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Obszar Zabiegu</Text>
            <View style={styles.zoneChipsRow}>
              {zoneNames.map((name, i) => (
                <View key={i} style={styles.zoneChip}>
                  <Text style={styles.zoneChipText}>{name}</Text>
                </View>
              ))}
            </View>
            {/* Face diagram */}
            {(FACE_DIAGRAM_TYPES.has(form.type) ||
              (form.type === "LASER_TATTOO_REMOVAL" &&
                form.nazwaProduktu !== "Tatuaż")) && (
              <>
                <Text
                  style={{
                    fontSize: 9,
                    color: "#8b8580",
                    marginTop: 12,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Wizualizacja obszaru zabiegu
                </Text>
                <FaceZoneDiagram
                  zones={getZonesForType(form.type)}
                  selectedIds={(form.obszarZabiegu || "")
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean)}
                />
              </>
            )}
            {/* Body diagram */}
            {(BODY_DIAGRAM_TYPES.has(form.type) ||
              (form.type === "LASER_TATTOO_REMOVAL" &&
                form.nazwaProduktu === "Tatuaż")) && (
              <>
                <Text
                  style={{
                    fontSize: 9,
                    color: "#8b8580",
                    marginTop: 12,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Wizualizacja obszaru zabiegu
                </Text>
                <BodyZoneDiagram
                  zones={BODY_ZONES}
                  selectedIds={(form.obszarZabiegu || "")
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean)}
                />
              </>
            )}
          </>
        )}

        <PageFooter salonName={SALON_CONFIG.fullName} />
      </Page>

      {/* STRONA 2: Wywiad Medyczny */}
      <Page size="A4" style={styles.page}>
        <View style={styles.miniHeader}>
          <MiniSalonLogo />
          <Text style={styles.miniTitle}>Wywiad Medyczny</Text>
        </View>

        <Text style={styles.sectionTitle}>
          Przeciwwskazania do Wykonania Zabiegu
        </Text>
        <View style={styles.contrTable}>
          {Object.entries(content.contraindications).map(
            ([key, question], index) => {
              const questionText =
                typeof question === "string" ? question : question.text;
              const hasFollowUp =
                typeof question !== "string" && question.hasFollowUp;
              const rawAnswer = przeciwwskazania[key];
              const isTrue =
                rawAnswer === true ||
                rawAnswer === "true" ||
                rawAnswer === "tak";
              const isFalse =
                rawAnswer === false ||
                rawAnswer === "false" ||
                rawAnswer === "nie" ||
                rawAnswer === null ||
                rawAnswer === undefined;
              const isFollowUpText =
                typeof rawAnswer === "string" &&
                rawAnswer !== "true" &&
                rawAnswer !== "false" &&
                rawAnswer !== "tak" &&
                rawAnswer !== "nie";

              return (
                <View key={key}>
                  <View
                    style={[
                      styles.contrRow,
                      index % 2 === 0 ? styles.contrRowAlt : {},
                    ]}
                  >
                    <Text style={styles.contrQuestion}>{questionText}</Text>
                    <Text
                      style={[
                        styles.contrAnswer,
                        {
                          color: isTrue || isFollowUpText ? RED : GREEN_DARK,
                        },
                      ]}
                    >
                      {isTrue || isFollowUpText
                        ? "TAK"
                        : isFalse
                          ? "NIE"
                          : "---"}
                    </Text>
                  </View>
                  {hasFollowUp && isFollowUpText && (
                    <Text style={styles.contrFollowUp}>
                      Szczegóły: {rawAnswer}
                    </Text>
                  )}
                </View>
              );
            },
          )}
        </View>

        {/* Additional info */}
        {form.informacjaDodatkowa && (
          <>
            <Text style={styles.sectionTitle}>Informacje Dodatkowe</Text>
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalInfoText}>
                {form.informacjaDodatkowa}
              </Text>
            </View>
          </>
        )}

        <PageFooter salonName={SALON_CONFIG.fullName} />
      </Page>

      {/* STRONA 3: Skutki, Zalecenia */}
      <Page size="A4" style={styles.page}>
        {/* Mini header */}
        <View style={styles.miniHeader}>
          <MiniSalonLogo />
          <Text style={styles.miniTitle}>{content.title} — Ciąg Dalszy</Text>
        </View>

        {/* Natural reactions */}
        <Text style={styles.sectionTitle}>Możliwe Reakcje Po Zabiegu</Text>
        <BulletList items={content.naturalReactions} />

        {/* Complications */}
        <Text style={styles.sectionTitle}>Możliwe Powikłania</Text>
        <View style={styles.complicationsRow}>
          {content.complications.czeste && (
            <View style={styles.complicationColumn}>
              <Text style={styles.complicationTitle}>Częste</Text>
              <BulletList items={content.complications.czeste} />
            </View>
          )}
          <View style={styles.complicationColumn}>
            {content.complications.rzadkie && (
              <>
                <Text style={styles.complicationTitle}>Rzadkie</Text>
                <BulletList items={content.complications.rzadkie} />
              </>
            )}
            {content.complications.bardzoRzadkie && (
              <>
                <Text style={styles.complicationTitle}>Bardzo Rzadkie</Text>
                <BulletList items={content.complications.bardzoRzadkie} />
              </>
            )}
          </View>
        </View>

        {/* Post-care */}
        <Text style={styles.sectionTitle}>Zalecenia Pozabiegowe</Text>
        <BulletList items={content.postCare} />

        <PageFooter salonName={SALON_CONFIG.fullName} />
      </Page>

      {/* STRONA 3: RODO */}
      <Page size="A4" style={styles.page}>
        <View style={styles.miniHeader}>
          <MiniSalonLogo />
          <Text style={styles.miniTitle}>Ochrona Danych Osobowych</Text>
        </View>

        {/* RODO Consent */}
        <Text style={styles.sectionTitle}>{rodoInfo.consentTitle}</Text>
        <View style={styles.rodoBox}>
          <Text style={styles.rodoText}>{rodoInfo.consentText}</Text>
        </View>
        <SignatureBlock
          signature={form.podpisRodo}
          label="Podpis klienta (zgoda RODO)"
        />

        {/* RODO Clause */}
        <Text style={styles.sectionTitle}>{rodoInfo.clauseTitle}</Text>
        <View style={styles.rodoBox}>
          <Text style={styles.rodoText}>{rodoInfo.clauseText}</Text>
        </View>
        <SignatureBlock
          signature={form.podpisRodo2}
          label="Podpis klienta (klauzula informacyjna)"
        />

        <PageFooter salonName={SALON_CONFIG.fullName} />
      </Page>

      {/* STRONA 4: Zgody i Podpisy */}
      <Page size="A4" style={styles.page}>
        {/* Mini header */}
        <View style={styles.miniHeader}>
          <MiniSalonLogo />
          <Text style={styles.miniTitle}>Zgody i Podpisy</Text>
        </View>

        {/* Consent checkboxes */}
        <Text style={styles.sectionTitle}>Udzielone Zgody</Text>
        <Checkbox
          checked={form.zgodaPrzetwarzanieDanych}
          label="Wyrażam zgodę na przetwarzanie moich danych osobowych"
        />
        <Checkbox
          checked={form.zgodaMarketing}
          label="Wyrażam zgodę na otrzymywanie informacji marketingowych"
        />
        <Checkbox
          checked={form.zgodaFotografie}
          label="Wyrażam zgodę na wykonywanie i wykorzystanie zdjęć"
        />
        {form.zgodaFotografie && form.miejscaPublikacjiFotografii && (
          <Text
            style={{
              fontSize: 6.5,
              color: GRAY,
              marginLeft: 16,
              marginBottom: 4,
            }}
          >
            Miejsca publikacji: {form.miejscaPublikacjiFotografii}
          </Text>
        )}
        <Checkbox
          checked={form.zgodaPomocPrawna}
          label="Wyrażam zgodę na udzielenie pierwszej pomocy prawnej"
        />

        {/* Main consent */}
        <View style={styles.consentBox}>
          <Text style={styles.consentTitle}>Świadoma Zgoda na Zabieg</Text>
          <Text style={styles.consentText}>
            Oświadczam, że zostałam/em poinformowana/y o rodzaju zabiegu, jego
            przebiegu, możliwych powikłaniach i efektach ubocznych. Rozumiem i
            akceptuję ryzyko związane z zabiegiem. Potwierdzam, że wszystkie
            podane przeze mnie informacje w wywiadzie medycznym są prawdziwe i
            zgodne ze stanem faktycznym. Wyrażam świadomą zgodę na wykonanie
            zabiegu.
          </Text>
          <SignatureBlock
            signature={form.podpisDane}
            label="Podpis klienta (świadoma zgoda na zabieg)"
          />
        </View>

        {/* Marketing consent */}
        {form.zgodaMarketing && (
          <View style={styles.consentBox}>
            <Text style={styles.consentTitle}>Zgoda Marketingowa</Text>
            <Text style={styles.consentText}>
              Wyrażam zgodę na otrzymywanie od {SALON_CONFIG.fullName}{" "}
              informacji handlowych i marketingowych za pośrednictwem środków
              komunikacji elektronicznej (SMS, e-mail).
            </Text>
            <SignatureBlock
              signature={form.podpisMarketing}
              label="Podpis klienta (zgoda marketingowa)"
            />
          </View>
        )}

        {/* Photography consent */}
        {form.zgodaFotografie && (
          <View style={styles.consentBox}>
            <Text style={styles.consentTitle}>
              Zgoda na Wykorzystanie Wizerunku
            </Text>
            <Text style={styles.consentText}>
              Wyrażam zgodę na wykonywanie i wykorzystanie zdjęć dokumentujących
              przebieg i efekty zabiegu w celach szkoleniowych i marketingowych{" "}
              {SALON_CONFIG.fullName}.
              {form.miejscaPublikacjiFotografii
                ? ` Miejsca publikacji: ${form.miejscaPublikacjiFotografii}.`
                : ""}
            </Text>
            <SignatureBlock
              signature={form.podpisFotografie}
              label="Podpis klienta (zgoda na wizerunek)"
            />
          </View>
        )}

        {/* Client reservations */}
        {form.zastrzeniaKlienta && (
          <View style={styles.consentBox}>
            <Text style={styles.consentTitle}>Zastrzeżenia Klienta</Text>
            <Text style={styles.consentText}>{form.zastrzeniaKlienta}</Text>
          </View>
        )}

        {/* Legal summary */}
        <Text style={styles.legalNote}>
          Dokument wygenerowany elektronicznie zgodnie z Art. 78¹ Kodeksu
          Cywilnego (forma dokumentowa). Podpis złożony za pośrednictwem
          urządzenia z ekranem dotykowym, zweryfikowany kodem SMS.
          {"\n"}
          Administrator danych: {SALON_CONFIG.fullName}, NIP: {SALON_CONFIG.nip}
          {"\n"}
          {SALON_CONFIG.address}, {SALON_CONFIG.zipCode} {SALON_CONFIG.city} |
          tel. {SALON_CONFIG.phone} | {SALON_CONFIG.email}
        </Text>

        <PageFooter salonName={SALON_CONFIG.fullName} />
      </Page>
    </Document>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateConsentFormPdf(form: any): Promise<Buffer> {
  const buffer = await renderToBuffer(<ConsentFormPdf form={form} />);
  return Buffer.from(buffer);
}
