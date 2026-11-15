import { View } from "react-native";

import { Button } from "@/components/shared/ui/Button/Button";
import { TextField } from "@/components/shared/ui/Text/TextField";

import { styles } from "./styles/CheckInSheet.styles";
import type { ActiveCheckInProps } from "./types/types";

export const ActiveCheckIn = ({
  active,
  checkIns,
  error,
  isMutationPending,
  onActionError,
}: ActiveCheckInProps): React.JSX.Element => {
  const runAction = async (action: () => Promise<unknown>): Promise<void> => {
    onActionError(null);
    try {
      await action();
    } catch (caught) {
      onActionError(
        caught instanceof Error ? caught.message : "Could not update check-in.",
      );
    }
  };

  return (
    <View>
      <TextField>
        Flight #{active.properties.id} · {active.properties.status}
      </TextField>
      <TextField>
        Started {new Date(active.properties.start_at).toLocaleString()}
      </TextField>
      {checkIns.uncertain ? (
        <TextField style={styles.formError}>
          Check-in status needs to be refreshed before another action.
        </TextField>
      ) : null}
      <Button
        disabled={isMutationPending || checkIns.uncertain}
        loading={checkIns.mutation === "end"}
        onPress={() => void runAction(checkIns.finish)}
        size="large"
        variant="secondary"
      >
        <TextField>End check-in</TextField>
      </Button>
      <Button
        disabled={isMutationPending}
        onPress={() => void runAction(checkIns.refreshActive)}
        size="small"
        variant="text"
      >
        <TextField>Refresh status</TextField>
      </Button>
      {error ? <TextField style={styles.formError}>{error}</TextField> : null}
    </View>
  );
};
